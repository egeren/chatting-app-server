import { userDatas } from "../data";
import { UserData } from "../data/userDatas";
import { checkEmpty } from "../helpers";

export const addNewUser = (id: string, username: string, avatar: string) => {
  const newUser = {
    id,
    username,
    avatar,
    isOnline: true,
  };

  return new Promise((resolve, reject) => {
    checkUserData(newUser)
      .then(() => {
        userDatas.push(newUser);
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const checkUserData = (user: UserData) => {
  return new Promise((resolve, reject) => {
    const { username, avatar } = user;
    const userNameCheck = checkEmpty(username);
    const avatarCheck = checkEmpty(avatar);
    if (userNameCheck) {
      reject("Username cannot be empty");
    } else if (avatarCheck) {
      reject("Avatar cannot be empty");
    } else {
      resolve(true);
    }
  });
};
