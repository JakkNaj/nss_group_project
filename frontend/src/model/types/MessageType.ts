import {EMessageType} from "../enums/EMessageType.ts";
import {MessageReferenceType} from "./MessageReference.ts";

export type MessageType = {
	messageLogId: number;
	id: string;
	content: string | null;
	senderId: number;
	type: EMessageType;
	timestampInSeconds: number;
	messageReference: MessageReferenceType | null;
};
