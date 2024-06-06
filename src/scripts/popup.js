document.getElementById('uploadCodeButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: extractCode
        }, (results) => {
            const code = results[0].result;

            console.log(code);

            const problemCodeElem = document.getElementById("problemCode");
            problemCodeElem.textContent = code;
        });
    });
});

document.getElementById('grabCodeButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: extractCode
        }, (results) => {
            const code = results[0].result;

            console.log(code);

            const problemCodeElem = document.getElementById("problemCode");
            problemCodeElem.textContent = code;
        });
    });
});

function extractCode() {
    function getCodeEditorDiv() {
        const divs = document.querySelectorAll("div");
    
        // check code block div
        for (const div of divs) {
            if (div.classList.contains("view-lines")) return div;
        }
    }
   
    var code = "";
    const parentDiv = getCodeEditorDiv();
    if (parentDiv) {
        const lineDivs = parentDiv.getElementsByClassName("view-line");
        for (const lineDiv of lineDivs) {
            code += `${lineDiv.textContent}\n`;
        }
    }
    return code;
}

document.getElementById('analyseButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: extractProblemInfo
        }, (results) => {
            console.log(results);

            const info = results[0].result;

            console.log(JSON.stringify(info));

            if (info)
                displayProblemInfo(info);
        });
    });
});

function displayProblemInfo(info) {
    const problemIdElem = document.getElementById("problemId");
    problemIdElem.textContent = `ID: ${info.id}`;

    const problemTitleElem = document.getElementById("problemTitle");
    problemTitleElem.textContent = `Title: ${info.title}`;
}

function extractProblemInfo() {
    class ProblemInfo {
        constructor(id, title) {
            this.id = id;
            this.title = title;
        }
    }

    // get all anchor tags
    const anchors = document.querySelectorAll("a");

    // find problem title anchor tag
    for (const anchor of anchors) {
        const re = /(\d+).\s+([\w\s]+)/;
        const result = anchor.textContent.match(re);

        if (result) return new ProblemInfo(result[1], result[2]);
    }
}