import { Options } from "../types";

export default class OptionsService {
    public static checkOptions(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                chrome.storage.sync.get(
                    { apiToken: null, username: null, email: null, repository: null },
                    (options) => {
                        console.log("options: ", options);
                        for (const property in options) {
                            const value = options[property];
                            if (value === null || (typeof value === "string" && value === ""))
                                resolve(false);
                        }
                        resolve(true);
                    }
                );
            } catch (err) {
                reject(`failed to check options: ${err}`)
            }
        });
    }

    public static saveOptions(options: Options): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // save data
            try {
                chrome.storage.sync.set(
                    { ...options },
                    () => {
                        resolve();
                    }
                );
            } catch (err) {
                reject(`failed to save options: ${err}`)
            }
        });
    }

    public static loadOptions(): Promise<Options> {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get(
                    { apiToken: null, username: null, email: null, repository: null },
                    (options) => {
                        resolve(options as Options);
                    }
                );
            } catch (err) {
                reject(`failed to load options: ${err}`);
            }
        });
    }
}