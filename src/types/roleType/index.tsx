export interface Role {
    id: number;
    title: string;
}

export interface RoleWithKey extends Role{
    key: number;
    index: number;
}
