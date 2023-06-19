export interface User {
    id: number;
    email: string;
    role_id: number;
}

export interface UserWithKey extends User{
    key: number;
    index: number;
}