import { Options } from "../../types";

export default class OptionsService {
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
                reject(`an error occurred while trying to save options: ${err}`)
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
                reject(`an error occurred while trying to load options: ${err}`);
            }
        });
    }
}