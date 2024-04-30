import { EChatType } from "../enums/EChatType.ts";

export type ChatRoomType = {
	chatLogId: number;
	name: string;
	type: EChatType;
	members: number[];
	avatar: string;
};
