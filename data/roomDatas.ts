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

const globalRooms: RoomData[] = [
  {
    id: "globalRoom1",
    roomName: "Global Room 1",
    roomDescription: "This is the first global room.",
    roomCreator: "",
    roomAvatar: "images/chat-logo.svg",
    roomUsers: [],
    roomMessages: [],
    isGlobal: true,
  },
];

export const roomDatas: RoomData[] = globalRooms;
