import { tokenDatas } from "../data/tokenDatas";

export const findTokenByUserId = (userId: string): string | undefined => {
  const value = tokenDatas.find((tokenData) => tokenData.userId === userId);
  if (value) {
    return value.token;
  }
  return undefined;
};

export const findUserIdByToken = (token: string): string | undefined => {
  const value = tokenDatas.find((tokenData) => tokenData.token === token);
  if (value) {
    return value.userId;
  }
  return undefined;
};

export const verifyToken = (token: string, userId: string): boolean => {
  const value = tokenDatas.find(
    (tokenData) => tokenData.token === token && tokenData.userId === userId
  );
  if (value) {
    return true;
  }
  return false;
};
