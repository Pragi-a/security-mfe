export interface LoginResponse {
  access_token: string;
  expires_in: number;
  user: { name: string; permissions: string[] };
}

export interface Item { id: number; name: string; }
export interface ItemRequest { name: string; }
