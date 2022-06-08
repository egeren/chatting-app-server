import { Socket } from "socket.io";

export interface UserData {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

export const userDatas: UserData[] = [];
