import {MessageType} from "./MessageType.ts";

export type ChatLogType = {
    id: string;     //elastic search
    messages: MessageType[];
}