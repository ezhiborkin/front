export interface Repo {
    id: number;
    repo: string;
}

export interface RepoWithKey extends Repo{
    key: number;
    index: number;
}