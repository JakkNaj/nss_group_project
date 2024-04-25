import { EChatType } from "../enums/EChatType.ts";
import { MessageType } from "./MessageType.ts";

export type ChatRoomType = {
	id: string; 		//elastic search
	name: string;
	type: EChatType;
	members: number[];
	avatar: string;
	messages: MessageType[];
	//todo add message log to each chat
};
