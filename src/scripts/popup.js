document.getElementById('analyseButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: extractProblemInfo
        }, (results) => {
            console.log(results);

            const info = results[0].result;

            console.log(JSON.stringify(info))

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