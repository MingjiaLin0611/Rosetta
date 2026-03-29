import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";

export { }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.name === "download") {
        sendResponse({ markdown: getMarkdown() });
    }
})

function getCleanedHTML() {
    const doClone = document.cloneNode(true) as Document;
    const reader = new Readability(doClone);
    const article = reader.parse();
    return article?.content || "";
}

export const getMarkdown = () => {
    const htmlContent = getCleanedHTML();
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(htmlContent);
    return markdown;
}

