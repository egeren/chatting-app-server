import { UserData } from "../data/userDatas";

export const checkEmpty = (data: string) => {
  data = data.replace(/\s/g, "");
  const err = data == "" || data == null || data == undefined;
  return err;
};

export const checkUserData = (user: UserData) => {
  return new Promise((resolve, reject) => {
    const { username, avatar } = user;
    const userNameCheck = checkEmpty(username);
    const avatarCheck = checkEmpty(avatar);
    if (userNameCheck) {
      reject("Username cannot be empty.");
    } else if (avatarCheck) {
      reject("Avatar cannot be empty.");
    } else {
      resolve(true);
    }
  });
};
