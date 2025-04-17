import type { BaseEmbeddings } from '@cherrystudio/embedjs-interfaces'
import { KnowledgeBaseParams } from '@types'

import EmbeddingsFactory from './EmbeddingsFactory'

// 模版（类）定义
// 导出给其他文件使用的模版
export default class Embeddings {
  // 私有属性
  // 类型申明为 BaseEmbeddings
  private sdk: BaseEmbeddings

  // 构造函数
  // 从传入的 KnowledgeBaseParams 对象中提取 model、apiKey、apiVersion、baseURL、dimensions 等字段
  constructor({ model, apiKey, apiVersion, baseURL, dimensions }: KnowledgeBaseParams) {
    this.sdk = EmbeddingsFactory.create({ model, apiKey, apiVersion, baseURL, dimensions } as KnowledgeBaseParams)
  }

  // 公有方法
  // 异步方法
  // 返回一个 Promise，该 Promise 的结果类型为 void
  // Promise 是一种用于处理异步操作的内置对象，有三种状态：Pending、Fulfilled、Rejected。
  public async init(): Promise<void> {
    return this.sdk.init()
  }

  // 获取当前使用的 embedding 模型所产生的向量维度，用于兼容性检查
  public async getDimensions(): Promise<number> {
    return this.sdk.getDimensions()
  }

  // 将多个文本批量转换为对应的 embedding 向量（知识库功能）
  public async embedDocuments(texts: string[]): Promise<number[][]> {
    return this.sdk.embedDocuments(texts)
  }

  // 将文本转换为对应的 embedding 向量（问答功能）
  public async embedQuery(text: string): Promise<number[]> {
    return this.sdk.embedQuery(text)
  }
}
