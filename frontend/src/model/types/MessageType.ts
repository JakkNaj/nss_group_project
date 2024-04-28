import {EMessageType} from "../enums/EMessageType.ts";

export type MessageType = {
	messageLogId: number;
	content: string | null;
	senderId: number;
	type: EMessageType;
	timestampInSeconds: number;
};
