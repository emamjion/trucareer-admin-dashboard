import { authKey } from "@/constants/authKey";
import { decodedToken } from "@/lib/jwt";
import { getFromLocalStorage, setToLocalStorage } from "@/lib/local.storage";

export const storeUserInfo = ({ token }: { token: string }) => {
  return setToLocalStorage(authKey, token);
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedData = decodedToken(authToken);
    console.log("Decoded data: ", decodedData);
  }
};
