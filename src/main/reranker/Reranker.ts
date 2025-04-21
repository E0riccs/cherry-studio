/**
 * 向上，承接KnowledgeService，隐藏具体的操作逻辑
 * 向下，使用工厂模式，创造具体的操作实例。
 */

import type { ExtractChunkData } from '@cherrystudio/embedjs-interfaces'
import { KnowledgeBaseParams } from '@types'

import BaseReranker from './BaseReranker'
import RerankerFactory from './RerankerFactory'

export default class Reranker {
  private sdk: BaseReranker
  constructor(base: KnowledgeBaseParams) {
    this.sdk = RerankerFactory.create(base)
  }
  public async rerank(query: string, searchResults: ExtractChunkData[]): Promise<ExtractChunkData[]> {
    return this.sdk.rerank(query, searchResults)
  }
}
