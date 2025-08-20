// 文件路径：/lib/notion/getNotionAPI.js
import { NotionAPI as OriginalNotionAPI } from 'notion-client'
import BLOG from '@/blog.config'

// 创建 NotionAPI 实例
const notionAPI = new OriginalNotionAPI({
  authToken: BLOG.NOTION_TOKEN_V2 || null,
  activeUser: BLOG.NOTION_ACTIVE_USER || null,
  userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

// 保存原始 getBlocks 方法
const originalGetBlocks = notionAPI.getBlocks.bind(notionAPI)

// Hook getBlocks 方法，修改 endpoint
notionAPI.getBlocks = async (blockIds, kyOptions) => {
  // 保存原始 fetch
  const originalFetch = notionAPI.fetch.bind(notionAPI)

  // 覆盖 fetch 临时修改 endpoint
  notionAPI.fetch = async ({ endpoint, ...rest }) => {
    if (endpoint === 'syncRecordValues') {
      // 改成新的 endpoint
      endpoint = 'syncRecordValuesMain' // <- 你要改成的 endpoint
    }
    return originalFetch({ endpoint, ...rest })
  }

  // 调用原始 getBlocks
  const result = await originalGetBlocks(blockIds, kyOptions)

  // 恢复 fetch，避免影响其他 API 调用
  notionAPI.fetch = originalFetch

  return result
}

export default notionAPI
