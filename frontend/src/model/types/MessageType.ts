import {EMessageType} from "../enums/EMessageType.ts";

export type MessageType = {
	messageLogId: number;
	content: string;
	idSender: number;
	type: EMessageType;
	timestamp: number;  //timestamp in seconds
};
