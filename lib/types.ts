export enum UserRole {
  Admin = 'admin',
  Merchant = 'merchant',
}

export interface JwtPayload {
  email: string
  role: string
  sub: string
  name: string
}

export interface JwtUserData {
  email: string
  role: string
  id: string
  name: string
}
