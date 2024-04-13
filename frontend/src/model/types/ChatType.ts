import { EChatType } from "../enums/EChatType.ts";
import { MessageType } from "./MessageType.ts";

export type ChatType = {
	id: number;
	avatar: string;
	type: EChatType;
	name: string;
	messages: MessageType[];
	users: number[];
};
