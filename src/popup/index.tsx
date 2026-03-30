import { useEffect, useState } from "react"

export const downloadMarkdown = (markdown: string, fileName: string) => {
  const blob = new Blob([markdown], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)

  chrome.downloads.download(
    {
      url: url,
      filename: fileName,
      saveAs: true
    },
    (downloadId) => {
      URL.revokeObjectURL(url)
      console.log(`下载任务已启动，ID: ${downloadId}`)
    }
  )
}

const receiveMessage = async () => {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab.length >= 0) {
    chrome.tabs.sendMessage(tab[0].id, { name: "download" }, (response) => {
      if (response && response.markdown) {
        downloadMarkdown(response.markdown, "article.md")
      }
    })
  }
}

function IndexPopup() {
  const [data, setData] = useState("")
  const [title, setTitle] = useState("")

  const receiveTitle = async () => {
    const tab = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.length > 0) {
      chrome.tabs.sendMessage(tab[0].id, { name: "title" }, (response) => {
        // 获取错误以防 Chrome 报错“Unchecked lastError”
        const error = chrome.runtime.lastError
        if (response && response.title) {
          setTitle(response.title)
        } else {
          setTitle(tab[0].title || "未能解析到文章标题")
        }
      })
    }
  }

  useEffect(() => {
    receiveTitle()
  }, [])

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>{title}</h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
      <button onClick={receiveMessage}>Download</button>
    </div>
  )
}

export default IndexPopup
