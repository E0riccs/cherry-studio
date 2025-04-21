import { ExtractChunkData } from '@cherrystudio/embedjs-interfaces'
import AxiosProxy from '@main/services/AxiosProxy'
import { KnowledgeBaseParams } from '@types'

import BaseReranker from './BaseReranker'

export default class JinaReranker extends BaseReranker {
  constructor(base: KnowledgeBaseParams) {
    super(base)
  }

  // 方法名 = (参数列表): 返回类型 => { 方法体 }
  public rerank = async (query: string, searchResults: ExtractChunkData[]): Promise<ExtractChunkData[]> => {
    const url = this.getRerankUrl()

    const requestBody = {
      model: this.base.rerankModel,
      query,
      documents: searchResults.map((doc) => doc.pageContent),
      top_n: this.base.topN // 指明返回前几个重新排序后的结果
    }

    try {
      // HTTP 客户端库的 post 方法
      // 解构赋值，从响应中提取 data 字段（API 返回的 JSON 数据）
      const { data } = await AxiosProxy.axios.post(url, requestBody, { headers: this.defaultHeaders() })

      const rerankResults = data.results
      return this.getRerankResult(searchResults, rerankResults)
    } catch (error: any) {
      const errorDetails = this.formatErrorMessage(url, error, requestBody)
      console.error('Jina Reranker API Error:', errorDetails)
      throw new Error(`重排序请求失败: ${error.message}\n请求详情: ${errorDetails}`)
    }
  }
}
