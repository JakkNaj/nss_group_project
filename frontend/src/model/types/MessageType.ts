import {EMessageType} from "../enums/EMessageType.ts";

export type MessageType = {
	//id: string; 		//i don't need them on frontend
	content: string;
	idSender: number;
	type: EMessageType;
	timestamp: number;  //timestamp in seconds
};
