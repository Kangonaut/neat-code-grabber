const availableProgrammingLanguages = [
    "C++", "Java", "Python", "Python3", "C", "C#",
    "JavaScript", "TypeScript", "PHP", "Swift",
    "Kotlin", "Dart", "Go", "Ruby", "Scala", "Rust",
    "Racket", "Erlang", "Elixir", "Pandas", "MySQL",
    "MS SQL Server", "Oracle", "PostgreSQL"
];

function getProblem() {
    // get all anchor tags
    const anchors = document.querySelectorAll("a");

    // find problem title anchor tag
    for (const anchor of anchors) {
        const re = /(\d+).\s+([\w\s]+)/;
        const result = anchor.textContent.match(re);

        if (result) {
            return {
                id: Number.parseInt(result[1]),
                title: result[2],
            };
        }
    }
}

function getProgrammingLanguage() {
    const buttons = document.querySelectorAll("button");

    for (const button of buttons) {
        const lang = button.textContent;

        // check if valid programming language
        if (availableProgrammingLanguages.includes(lang)) {
            return lang;
        }
    }
}

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
        sendResponse({ content });
    } else if (request.action === "getProblem") {
        const problem = getProblem();
        sendResponse({ problem });
    } else if (request.action === "getProgrammingLanguage") {
        const language = getProgrammingLanguage();
        sendResponse({ language });
    }
});