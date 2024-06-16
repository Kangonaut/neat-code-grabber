export interface ProblemDetails {
    id: number;
    title: string;
}

export interface FilePublic {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    content: string;
    encoding: string;
}

export interface Options {
    apiToken: string | null;
    username: string | null;
    email: string | null;
    repository: string | null;
}