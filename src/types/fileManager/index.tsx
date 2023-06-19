export interface File {
    id: number;
    title: string;
}

export interface FileWithKey extends File{
    key: string;
    index: number;
}