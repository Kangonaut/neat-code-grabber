const GITHUB_API_URL = "https://api.github.com";

export async function getRemoteFile(filename) {
    const storage = await chrome.storage.sync.get({ githubApiToken: null, githubName: null, githubRepo: null });

    const response = await fetch(
        `${GITHUB_API_URL}/repos/${storage.githubName}/${storage.githubRepo}/contents/${filename}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storage.githubApiToken}`,
            },
        }
    );

    if (response.status === 200) {
        const body = await response.json();
        return body;
    } else if (response.status === 404) {
        return null;
    } else {
        console.error(`error occurred while trying to fetch file: ${response.status} - ${response.statusText}`)
    }
}


export async function createRemoteFile(filename, content) {
    const storage = await chrome.storage.sync.get({ githubApiToken: null, githubName: null, githubEmail: null, githubRepo: null });

    // encode the content using base64
    const encodedContent = btoa(content);
    const body = {
        message: `add ${filename}`,
        committer: {
            name: storage.githubName,
            email: storage.githubEmail,
        },
        content: encodedContent,
    };

    const response = await fetch(
        `${GITHUB_API_URL}/repos/${storage.githubName}/${storage.githubRepo}/contents/${filename}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storage.githubApiToken}`,
            },
            body: JSON.stringify(body),
        }
    );

    if (response.status !== 201) {
        console.error(`an error occurred while trying to create file: ${response.status} - ${response.statusText}`);
    }
}

export async function updateRemoteFile(filename, content, sha) {
    const storage = await chrome.storage.sync.get({ githubApiToken: null, githubName: null, githubEmail: null, githubRepo: null });

    // encode the content using base64
    const encodedContent = btoa(content);
    const body = {
        message: `add ${filename}`,
        committer: {
            name: storage.githubName,
            email: storage.githubEmail,
        },
        content: encodedContent,
        sha: sha,
    };

    const response = await fetch(
        `${GITHUB_API_URL}/repos/${storage.githubName}/${storage.githubRepo}/contents/${filename}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storage.githubApiToken}`,
            },
            body: JSON.stringify(body),
        }
    );

    if (response.status !== 200) {
        console.error(`an error occurred while trying to update file: ${response.status} - ${response.statusText}`);
    }
}