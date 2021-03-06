import { MessageData } from "./messageDatas";
import { UserData } from "./userDatas";

export interface RoomData {
  id: string;
  roomName: string;
  roomDescription: string;
  roomCreator: string;
  roomAvatar: string;
  roomUsers: UserData[];
  roomMessages: MessageData[];
  isGlobal: boolean;
}

export const globalRooms: RoomData[] = [
  {
    id: "globalRoom1",
    roomName: "Global Room 1",
    roomDescription: "This is the first global room.",
    roomCreator: "",
    roomAvatar: "chat-logo.png",
    roomUsers: [],
    roomMessages: [],
    isGlobal: true,
  },
];

export const roomDatas: RoomData[] = globalRooms;
