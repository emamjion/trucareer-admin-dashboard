import { jwtDecode } from "jwt-decode";

export const decodedToken = (token: string) => {
  const decoded = jwtDecode(token);
  return decoded;
};
