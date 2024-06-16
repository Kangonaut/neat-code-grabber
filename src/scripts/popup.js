import { getRemoteFile, createRemoteFile, updateRemoteFile } from "./api.js";

const DEFAULT_PROGRAMMING_LANG = "C++";
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
const uploadCodeButton = document.getElementById("uploadCodeButton");
const updateCodeButton = document.getElementById("updateCodeButton");
const copyToClipboardButton = document.getElementById("copyToClipboardButton");

const problemDiv = document.getElementById("problemDiv");
const noProblemDiv = document.getElementById("noProblemDiv");
const errorsDiv = document.getElementById("errorsDiv");
const errorMessageElem = document.getElementById("errorMessage");
const actionResultMessageElem = document.getElementById("actionResultMessage");

function populateProgrammingLanguageSelection() {
    for (const language of programmingLanguageExtensions.keys()) {
        const option = document.createElement("option");
        option.value = option.textContent = language;
        programmingLanguageSelect.appendChild(option);
    }
}

async function isProblemPage() {
    const pattern = /https:\/\/leetcode\.com\/problems\/.*/;
    return await matchUrl(pattern);
}

function matchUrl(pattern) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const tab = tabs[0];
                const url = tab.url;

                console.log(`url: ${url}`);

                const isMatch = pattern.test(url);
                resolve(isMatch);
            } else {
                reject("no active tab found");
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await reloadContent();
});

async function reloadContent() {
    // reset visibility
    problemDiv.style.display = "none";
    errorsDiv.style.display = "none";
    noProblemDiv.style.display = "none";

    // reset buttons
    uploadCodeButton.disabled = true;
    uploadCodeButton.className = "btn col-4";
    updateCodeButton.disabled = true;
    updateCodeButton.className = "btn col-4";
    copyToClipboardButton.disabled = true;
    copyToClipboardButton.className = "btn col-8";

    try {
        const isProblem = await isProblemPage();

        if (isProblem) {
            problemDiv.style.display = "block";

            populateProgrammingLanguageSelection();

            const problem = await getProblem();
            if (problem) displayProblem(problem);

            const language = (await getProgrammingLanguage()) ?? DEFAULT_PROGRAMMING_LANG;
            console.log("select lang: ", language);
            programmingLanguageSelect.value = language;

            const filename = `${problem.id.toString().padStart(4, "0")}.${programmingLanguageExtensions.get(language)}`;
            const file = await getRemoteFile(filename);
            console.log(file);

            // retrieve editor content
            const editorContent = await getEditorContent();

            // decode file content
            const fileContent = atob(file.content);

            // set button visibility
            uploadCodeButton.disabled = file;
            uploadCodeButton.className += file ? " disabled" : " btn-outline-primary";
            updateCodeButton.disabled = !(file && editorContent !== fileContent);
            updateCodeButton.className += !(file && editorContent !== fileContent) ? " disabled" : " btn-outline-primary";
            copyToClipboardButton.disabled = !file;
            copyToClipboardButton.className += !file ? " disabled" : " btn-outline-primary";

            uploadCodeButton.onclick = async () => {
                try {
                    await createRemoteFile(filename, editorContent);
                    actionResultMessageElem.textContent = `${filename} successfully created`;
                    await reloadContent();
                } catch (err) {

                }
            }
            updateCodeButton.onclick = async () => {
                try {
                    await updateRemoteFile(filename, editorContent, file.sha);
                    actionResultMessageElem.textContent = `${filename} successfully updated`;
                    await reloadContent();
                } catch (err) {

                }
            }

            copyToClipboardButton.onclick = async () => {
                navigator.clipboard.writeText(fileContent);
            }
        } else {
            noProblemDiv.style.display = "block";
        }
    } catch (err) {
        errorsDiv.style.display = "block";
        errorMessageElem.textContent = err.message;
    }
}

function displayProblem(problem) {
    const problemIdElem = document.getElementById("problemId");
    problemIdElem.textContent = problem.id;

    const problemTitleElem = document.getElementById("problemTitle");
    problemTitleElem.textContent = problem.title;
}

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
