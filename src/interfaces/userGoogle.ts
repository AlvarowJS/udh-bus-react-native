export interface userRequest {
    name: string | null;
    email: string | null;
    photo: string | null;
    id: string | null;
}

export interface userResponse {
    access_token: string;
    data: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
        codigo: string;
        avatar: string;
        external_id: string;
        external_auth: string;
    }
}