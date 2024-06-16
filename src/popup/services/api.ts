import { FilePublic } from "../../types";

export class ApiService {
    private static readonly API_URL = "https://api.github.com";

    public static async getRemoteFile(filename: string): Promise<FilePublic | null> {
        const storage = await chrome.storage.sync.get({ apiToken: null, username: null, repository: null });

        const response = await fetch(
            `${this.API_URL}/repos/${storage.username}/${storage.repository}/contents/${filename}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.apiToken}`,
                },
            }
        );

        if (response.status === 200) {
            const body = await response.json();
            return body;
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error(`error occurred while trying to fetch file: ${response.status} - ${response.statusText}`);
        }
    }


    public static async createRemoteFile(filename: string, content: string): Promise<void> {
        const storage = await chrome.storage.sync.get({ apiToken: null, username: null, email: null, repository: null });

        // encode the content using base64
        const encodedContent = btoa(content);
        const body = {
            message: `add ${filename}`,
            committer: {
                name: storage.username,
                email: storage.email,
            },
            content: encodedContent,
        };

        const response = await fetch(
            `${this.API_URL}/repos/${storage.username}/${storage.repository}/contents/${filename}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.apiToken}`,
                },
                body: JSON.stringify(body),
            }
        );

        if (response.status !== 201) {
            throw new Error(`an error occurred while trying to create file: ${response.status} - ${response.statusText}`);
        }
    }

    public static async updateRemoteFile(filename: string, content: string, sha: string): Promise<void> {
        const storage = await chrome.storage.sync.get({ apiToken: null, username: null, email: null, repository: null });

        // encode the content using base64
        const encodedContent = btoa(content);
        const body = {
            message: `update ${filename}`,
            committer: {
                name: storage.username,
                email: storage.email,
            },
            content: encodedContent,
            sha: sha,
        };

        const response = await fetch(
            `${this.API_URL}/repos/${storage.username}/${storage.repository}/contents/${filename}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.apiToken}`,
                },
                body: JSON.stringify(body),
            }
        );

        if (response.status !== 200) {
            throw new Error(`an error occurred while trying to update file: ${response.status} - ${response.statusText}`);
        }
    }
}