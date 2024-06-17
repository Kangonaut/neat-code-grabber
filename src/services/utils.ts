import { programmingLanguageExtensions } from "../languages";

export class Utils {
    public static async isProblemPage(): Promise<boolean> {
        const pattern = /https:\/\/leetcode\.com\/problems\/.*/;
        return await this.matchUrl(pattern);
    }

    public static matchUrl(pattern: RegExp): Promise<boolean> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const tab = tabs[0];
                    const url = tab.url;

                    const isMatch = (url !== undefined) && pattern.test(url);
                    resolve(isMatch);
                } else {
                    reject("failed to match URL: no active tab found");
                }
            });
        });
    }

    public static buildFilename(id: number, language: string) {
        const extension = programmingLanguageExtensions[language];
        return `${id.toString().padStart(4, "0")}.${extension}`;
    }
}