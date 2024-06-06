const GITHUB_API_URL = "https://api.github.com";
const programmingLanguageExtensions = new Map([
    ["C++", "cpp"],
    ["Java", "java"],
    ["Python", "py"],
    ["Python3", "py"],
    ["C", "c"],
    ["C#", "cs"],
    ["JavaScript", "js"],
    ["TypeScript", "ts"],
    ["PHP", "php"],
    ["Swift", "swift"],
    ["Kotlin", "kt"],
    ["Dart", "dart"],
    ["Go", "go"],
    ["Ruby", "rb"],
    ["Scala", "scala"],
    ["Rust", "rs"],
    ["Racket", "rkt"],
    ["Erlang", "erl"],
    ["Elixir", "ex"],
    ["Elixir", "exs"],
    ["Pandas", "py"],
    ["MySQL", "sql"],
    ["MS SQL Server", "sql"],
    ["Oracle", "sql"],
    ["PostgreSQL", "sql"],
]);

const programmingLanguageSelect = document.getElementById("programmingLanguageSelect");

function populateProgrammingLanguageSelection() {
    for (const language of programmingLanguageExtensions.keys()) {
        const option = document.createElement("option");
        option.value = option.textContent = language;
        programmingLanguageSelect.appendChild(option);
    }
}

populateProgrammingLanguageSelection();

document.addEventListener('DOMContentLoaded', async () => {
    const problem = await getProblem();
    if (problem) displayProblem(problem);

    const language = await getProgrammingLanguage();
    console.log("select lang: ", language);
    if (language) {
        programmingLanguageSelect.value = language;
    }
});

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

async function getRemoteFile(name) {
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
}

async function createRemoteFile() {

}

async function updateRemoteFile() {

}

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

function getProblem() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                return reject("no active tab found");
            }
            chrome.tabs.sendMessage(tabs[0].id, { action: "getProblem" }, (response) => {
                if (response && response.problem) {
                    resolve(response.problem);
                } else {
                    reject("failed to retrieve problem");
                }
            });
        });
    });
}

function getProgrammingLanguage() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                return reject("no active tab found");
            }
            chrome.tabs.sendMessage(tabs[0].id, { action: "getProgrammingLanguage" }, (response) => {
                if (response && response.language) {
                    resolve(response.language);
                } else {
                    reject("failed to retrieve programming language");
                }
            });
        });
    });
}

document.getElementById('analyseButton').addEventListener('click', async () => {
    const problem = await getProblem();
    if (problem) displayProblem(problem);
});

function displayProblem(problem) {
    const problemIdElem = document.getElementById("problemId");
    problemIdElem.textContent = `ID: ${problem.id}`;

    const problemTitleElem = document.getElementById("problemTitle");
    problemTitleElem.textContent = `Title: ${problem.title}`;
}