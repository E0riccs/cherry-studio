import type { ExtractChunkData } from '@cherrystudio/embedjs-interfaces'
import { KnowledgeBaseParams } from '@types'

export default abstract class BaseReranker {
  protected base: KnowledgeBaseParams

  constructor(base: KnowledgeBaseParams) {
    if (!base.rerankModel) {
      throw new Error('Rerank model is required')
    }
    this.base = base
  }

  abstract rerank(query: string, searchResults: ExtractChunkData[]): Promise<ExtractChunkData[]>

  /**
   * Get Rerank Request Url
   */
  protected getRerankUrl() {
    let baseURL = this.base?.rerankBaseURL?.endsWith('/')
      ? this.base.rerankBaseURL.slice(0, -1)
      : this.base.rerankBaseURL
    // 必须携带/v1，否则会404
    if (baseURL && !baseURL.endsWith('/v1')) {
      baseURL = `${baseURL}/v1`
    }

    return `${baseURL}/rerank`
  }

  /**
   * Get Rerank Result
   * 将 rerank 结果结合原始 search 结果
   * rerank 结果只含有原始 index 和 对应相关性得分
   * serchresult 结果含有原始 index、文本信息
   * @param searchResults
   * @param rerankResults
   * @protected
   */
  protected getRerankResult(
    searchResults: ExtractChunkData[],
    rerankResults: Array<{
      index: number
      relevance_score: number
    }>
  ) {
    // 构建一个map，key为index，value为relevance_score
    // map 遍历 searchResults ，将每个元素转换为一个键值对数组，用 0 替代 null 等异常值
    // 将键值对数组转换为一个 Map 对象
    const resultMap = new Map(rerankResults.map((result) => [result.index, result.relevance_score || 0]))

    // 遍历 searchResults ，执行方法体 / for index, doc in enumerate(search_results):
    return searchResults
      .map((doc: ExtractChunkData, index: number) => {
        const score = resultMap.get(index)
        if (score === undefined) return undefined

        return {
          // 原文档所有信息
          ...doc,
          // 分数信息
          score
        }
      })
      .filter((doc): doc is ExtractChunkData => doc !== undefined) // 过滤无分数文档
      .sort((a, b) => b.score - a.score) // 排序
  }

  public defaultHeaders() {
    return {
      Authorization: `Bearer ${this.base.rerankApiKey}`,
      'Content-Type': 'application/json'
    }
  }

  protected formatErrorMessage(url: string, error: any, requestBody: any) {
    const errorDetails = {
      url: url,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      requestBody: requestBody
    }
    return JSON.stringify(errorDetails, null, 2)
  }
}
