const GITHUB_API_URL = "https://api.github.com";

document.getElementById('uploadCodeButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getEditorContent" }, (response) => {
            if (response && response.content) {
                console.log('Editor Content:', response.content);
                uploadCode(response.content);
            } else {
                console.error("failed to retrieve editor content");
            }
        });
    });
});

async function uploadCode(code) {
    const encodedCode = btoa(code);
    console.log(encodedCode);

    const storage = await chrome.storage.sync.get({ githubApiToken: null, githubName: null, githubEmail: null, githubRepo: null });

    const problemId = 1117;
    if (code) {
        const body = {
            message: `add ${problemId}`,
            committer: {
                name: storage.githubName,
                email: storage.githubEmail,
            },
            content: encodedCode,
        };
        const response = await fetch(
            `${GITHUB_API_URL}/repos/${storage.githubName}/${storage.githubRepo}/contents/${problemId}.txt`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.githubApiToken}`,
                },
                body: JSON.stringify(body),
            }
        );
        if (response.status == 201) {
            const result = await response.json();
            console.log(result);
        } else {
            console.error(`code upload request failed: ${response.status} - ${response.statusText}`);
        }
    }
}

document.getElementById('grabCodeButton').addEventListener('click', async () => {
    const editorContent = await getEditorContent();

    const problemCodeElem = document.getElementById("problemCode");
    problemCodeElem.textContent = editorContent;
});

function getEditorContent() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                return reject("no active tab found");
            }
            chrome.tabs.sendMessage(tabs[0].id, { action: "getEditorContent" }, (response) => {
                if (response && response.content) {
                    resolve(response.content);
                } else {
                    reject("failed to retrieve editor content");
                }
            });
        });
    });
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