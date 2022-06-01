import { userDatas } from "../data";
import { v4 as uuid } from "uuid";
import { UserData } from "../data/userDatas";
import { checkEmpty, checkUserData } from "../helpers";
import { tokenDatas } from "../data/tokenDatas";

export const addNewUser = (username: string, avatar: string) => {
  const newUser = {
    id: uuid(),
    username,
    avatar,
    isOnline: true,
  };

  const token = uuid();

  return new Promise((resolve, reject) => {
    checkUserData(newUser)
      .then(() => {
        userDatas.push(newUser);
        tokenDatas.push({ token: token, userId: newUser.id });
        resolve({ ...newUser, token: token });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
