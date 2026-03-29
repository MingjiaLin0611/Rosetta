import { useState } from "react"

export const downloadMarkdown = (markdown: string, fileName: string) => {
	const blob = new Blob([markdown], { type: "text/markdown" })
	const url = URL.createObjectURL(blob)

	chrome.downloads.download({
		url: url,
		filename: fileName,
		saveAs: true
	}, (downloadId) => {
		URL.revokeObjectURL(url)
		console.log(`下载任务已启动，ID: ${downloadId}`)
	})
}

const receiveMessage = async () => {
	const tab = await chrome.tabs.query({ active: true, currentWindow: true });
	if (tab.length >= 0) {
		chrome.tabs.sendMessage(tab[0].id, { name: 'download' }, (response) => {
			if (response && response.markdown) {
				downloadMarkdown(response.markdown, 'article.md');
			}
		});
	}

}

function IndexPopup() {
	const [data, setData] = useState("");

	return (
		<div
			style={{
				padding: 16
			}}>
			<h2>
				Welcome to your{" "}
				<a href="https://www.plasmo.com" target="_blank">
					Rosetta
				</a>{" "}
				Extension!
			</h2>
			<input onChange={(e) => setData(e.target.value)} value={data} />
			<a href="https://docs.plasmo.com" target="_blank">
				View Docs
			</a>
			<button onClick={receiveMessage}>Download</button>
		</div>
	)
}

export default IndexPopup
