export interface MessageData {
  id: string;
  roomId: string;
  userId: string;
  message: string;
  timestamp: Date;
}

export const messageDatas: MessageData[] = [];
