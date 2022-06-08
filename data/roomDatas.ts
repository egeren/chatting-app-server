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
    roomAvatar: "images/chat-logo.svg",
    roomUsers: [],
    roomMessages: [
      {
        id: "dummyUser",
        roomId: "globalRoom1",
        userId: "dummyUser",
        message: "this is dummy message.",
        timestamp: new Date(),
      },
    ],
    isGlobal: true,
  },
];

export const roomDatas: RoomData[] = globalRooms;
