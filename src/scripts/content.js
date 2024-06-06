function getEditorContent() {
    function getEditorDiv() {
        const divs = document.querySelectorAll("div");

        // check code block div
        for (const div of divs) {
            if (div.classList.contains("view-lines")) return div;
        }
    }

    // extract content from divs
    var code = "";
    const parentDiv = getEditorDiv();
    if (parentDiv) {
        const lineDivs = parentDiv.getElementsByClassName("view-line");
        for (const lineDiv of lineDivs) {
            code += `${lineDiv.textContent}\n`;
        }
    }

    // clean code string
    code = code.replace(/\u00A0/g, " ");

    return code;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getEditorContent") {
        const content = getEditorContent();
        console.log(`editor content: ${content}`);
        sendResponse({ content });
    }
});