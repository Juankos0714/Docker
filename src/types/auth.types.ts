export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
}