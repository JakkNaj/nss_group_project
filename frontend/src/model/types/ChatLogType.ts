import {MessageType} from "./MessageType.ts";

export type ChatLogType = {
    chatLogId: number;
    messages: MessageType[];
}