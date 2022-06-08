import { UserData } from "../data/userDatas";

export const checkEmpty = (data: string) => {
  if (!data) return true;
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

export const generateProfileGradient = () => {
  const rand = parseInt(
    (Math.random() * profileGradients.length - 1).toFixed(0)
  );
  return "{gradient}" + profileGradients[rand];
};

const profileGradients = [
  "from-cyan-500 to-blue-500",
  "from-purple-500 to-pink-400",
  "from-orange-500 to-red-500",
  "from-blue-500 to-purple-500",
  "from-purple-800 to-pink-500",
  "from-green-400 to-green-600",
  "from-red-600 to-red-500",
  "from-orange-600 to-orange-500",
  "from-cyan-700 to-sky-600",
  "from-pink-500 to-pink-400",
];
