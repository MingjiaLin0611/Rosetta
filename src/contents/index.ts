import { Readability } from "@mozilla/readability"
import TurndownService from "turndown"

export {}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === "download") {
    sendResponse({ markdown: getMarkdown() })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === "title") {
    try {
      const article = getCleanedHTML()
      sendResponse({ title: article ? article.title : null })
    } catch (error) {
      console.error(error)
      sendResponse({ title: null })
    }
  }
})

function getCleanedHTML() {
  const doClone = document.cloneNode(true) as Document
  const reader = new Readability(doClone)
  const article = reader.parse()
  console.log(article)
  return article
}

export const getMarkdown = () => {
  const article = getCleanedHTML()
  if (!article) {
    return "无法解析文章内容。"
  }
  const htmlContent = article.content
  const turndownService = new TurndownService()
  const markdown = turndownService.turndown(htmlContent)
  return markdown
}
