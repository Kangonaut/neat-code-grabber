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

export enum StatusType {
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info",
}

export const statusTypeColors: { [key in StatusType]: string } = {
    [StatusType.SUCCESS]: "green",
    [StatusType.ERROR]: "red",
    [StatusType.INFO]: "blue",
}

export const statusTypeEmoticons: { [key in StatusType]: string } = {
    [StatusType.SUCCESS]: ":D",
    [StatusType.ERROR]: ":(",
    [StatusType.INFO]: ":|",
}
