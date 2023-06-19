export interface RepoP {
    id: number;
    role_title: string;
    path: string;
    permission: string;
}

export interface RepoPWithKey extends RepoP{
    key: string;
    index: number;
}