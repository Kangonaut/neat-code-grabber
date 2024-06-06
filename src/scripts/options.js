const githubApiTokenStatusElem = document.getElementById("githubApiTokenStatus");
const githubApiTokenInput = document.getElementById("githubApiTokenInput");
const githubNameInput = document.getElementById("githubNameInput");
const githubEmailInput = document.getElementById("githubEmailInput");
const githubRepoInput = document.getElementById("githubRepoInput");

function displayGithubApiTokenStatus(status) {
    githubApiTokenStatusElem.textContent = status ? "SET" : "UNSET";
    githubApiTokenStatusElem.className = status ? "fst-italic fw-bold text-success" : "fst-italic fw-bold text-danger";
}

function saveOptions() {
    const githubApiToken = githubApiTokenInput.value;
    const githubName = githubNameInput.value;
    const githubEmail = githubEmailInput.value;
    const githubRepo = githubRepoInput.value;

    var data = {
        githubName: githubName,
        githubEmail: githubEmail,
        githubRepo: githubRepo,
    };

    // check if API token has been updated
    if (githubApiToken) {
        data.githubApiToken = githubApiToken;
    }

    // save data
    chrome.storage.sync.set(
        data,
        () => {
            // udpate status
            restoreOptions();
        }
    );
}

function restoreOptions() {
    chrome.storage.sync.get(
        { githubApiToken: null, githubName: null, githubEmail: null, githubRepo: null },
        (items) => {
            displayGithubApiTokenStatus(Boolean(items.githubApiToken));

            githubNameInput.value = items.githubName;
            githubEmailInput.value = items.githubEmail;
            githubRepoInput.value = items.githubRepo;
        }
    );
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("saveOptionsButton").addEventListener("click", saveOptions);