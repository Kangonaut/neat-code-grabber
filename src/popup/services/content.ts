import { ProblemDetails } from "../../types";

export class ContentService {
    public static getProblemDetails(): Promise<ProblemDetails> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) {
                    return reject("no active tab found");
                }

                chrome.tabs.sendMessage(tabs[0].id!, { action: "getProblem" }, (response) => {
                    if (response && response.problem) {
                        resolve(response.problem);
                    } else {
                        reject("failed to retrieve problem");
                    }
                });
            });
        });
    }

    public static getProgrammingLanguage(): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) {
                    return reject("no active tab found");
                }
                chrome.tabs.sendMessage(tabs[0].id!, { action: "getProgrammingLanguage" }, (response) => {
                    if (response && response.language) {
                        resolve(response.language);
                    } else {
                        reject("failed to retrieve programming language");
                    }
                });
            });
        });
    }

    public static getEditorContent(): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) {
                    return reject("no active tab found");
                }
                chrome.tabs.sendMessage(tabs[0].id!, { action: "getEditorContent" }, (response) => {
                    if (response && response.content) {
                        resolve(response.content);
                    } else {
                        reject("failed to retrieve editor content");
                    }
                });
            });
        });
    }
}


