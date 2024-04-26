import {EMessageType} from "../enums/EMessageType.ts";

export type MessageType = {
	messageLogId: number;
	content: string;
	senderId: number;
	type: EMessageType;
	timestampInSeconds: number;
};
