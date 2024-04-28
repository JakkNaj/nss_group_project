import {EChatType} from "./model/enums/EChatType";
import {ChatRoomType} from "./model/types/ChatRoomType.ts";
import {UserType} from "./model/types/UserType.ts";
import {ChatLogType} from "./model/types/ChatLogType.ts";
import {EMessageType} from "./model/enums/EMessageType.ts";

export const usersData: UserType[] = [
	{
		id: 1,
		avatar: "",
		name: "Adam Auro",
		email: "adam.auro@example.com",
		phoneNumber: "123-456-7890",
		username: "adam.auro",
	},
	{
		id: 2,
		avatar: "",
		name: "Jane Doe",
		email: "jane.doe@example.com",
		phoneNumber: "234-567-8901",
		username: "jane.doe",
	},
	{
		id: 3,
		avatar: "",
		name: "Kristin Watson",
		email: "kristin.watson@example.com",
		phoneNumber: "345-678-9012",
		username: "kristin.watson",
	},
	{
		id: 4,
		avatar: "",
		name: "Dianne Russell",
		email: "dianne.russell@example.com",
		phoneNumber: "456-789-0123",
		username: "dianne.russell",
	},
	{
		id: 5,
		avatar: "",
		name: "Wade Warren",
		email: "wade.warren@example.com",
		phoneNumber: "567-890-1234",
		username: "wade.warren",
	},
	{
		id: 6,
		avatar: "",
		name: "Tobias Le",
		email: "tobias.le@example.com",
		phoneNumber: "678-901-2345",
		username: "tobias.le",
	},
	{
		id: 7,
		avatar: "",
		name: "Adam Schuppler",
		email: "adam.schuppler@example.com",
		phoneNumber: "789-012-3456",
		username: "adam.schuppler",
	},
	{
		id: 8,
		avatar: "",
		name: "Jakub Najman",
		email: "jakub.naj@example.com",
		phoneNumber: "789-012-3456",
		username: "jak.n",
	},
];

export const chatRoomsData: ChatRoomType[] = [
	{
		chatLogId: 1,
		type: EChatType.ONE_ON_ONE,
		avatar: "",
		name: "Direct Chat 1",
		members: [1, 2],
	},
	{
		chatLogId: 2,
		type: EChatType.GROUP,
		avatar: "",
		name: "Volleyball Group Chat",
		members: [3, 4, 1],
	},
	{
		chatLogId: 3,
		type: EChatType.ONE_ON_ONE,
		avatar: "",
		name: "Direct Chat 2",
		members: [6, 1],
	},
	{
		chatLogId: 4,
		type: EChatType.GROUP,
		avatar: "",
		name: "Group Chat 1",
		members: [1, 3, 5],
	},
	{
		chatLogId: 5,
		type: EChatType.ONE_ON_ONE,
		avatar: "",
		name: "Direct Chat 3",
		members: [4, 1],
	},
	{
		chatLogId: 6,
		type: EChatType.GROUP,
		avatar: "",
		name: "Group Chat 2",
		members: [7, 6, 1],
	},
	{
		chatLogId: 7,
		type: EChatType.ONE_ON_ONE,
		avatar: "",
		name: "Direct Chat 4",
		members: [5, 1],
	},
];

export const chatLogsData: ChatLogType[] = [
	{
		chatLogId: 1,
		messages: [
			{ messageLogId: 1, content: "Hey, how are you?", senderId: 1, timestampInSeconds: Math.floor(new Date("2023-01-01T10:00:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 1, content: "I'm good, thanks! How about you?", senderId: 2, timestampInSeconds: Math.floor(new Date("2023-01-01T10:05:00Z").getTime() / 1000), type: EMessageType.CHAT },
		],
	},
	{
		chatLogId: 2,
		messages: [
			{ messageLogId: 2, content: "Hello everyone!", senderId: 3, timestampInSeconds: Math.floor(new Date("2023-01-02T10:00:00Z").getTime() / 1000), type: EMessageType.CHAT},
			{ messageLogId: 2, content: "Hi!", senderId: 4, timestampInSeconds: Math.floor(new Date("2023-01-02T10:05:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 2, content: "Hey!", senderId: 1, timestampInSeconds: Math.floor(new Date("2023-01-02T10:10:00Z").getTime() / 1000), type: EMessageType.CHAT },
		],
	},
	{
		chatLogId: 3,
		messages: [
			{ messageLogId: 3, content: "Did you finish the task?", senderId: 6, timestampInSeconds: Math.floor(new Date("2023-01-03T10:00:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 3, content: "Yes, I just submitted it.", senderId: 1, timestampInSeconds: Math.floor(new Date("2023-01-03T10:05:00Z").getTime() / 1000), type: EMessageType.CHAT },
		],
	},
	{
		chatLogId: 4,
		messages: [
			{ messageLogId: 4, content: "Let's meet at 5pm", senderId: 1, timestampInSeconds: Math.floor(new Date("2023-01-04T10:00:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 4, content: "Sounds good!", senderId: 3, timestampInSeconds: Math.floor(new Date("2023-01-04T10:05:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 4, content: "I'll be there.", senderId: 5, timestampInSeconds: Math.floor(new Date("2023-01-04T10:10:00Z").getTime() / 1000), type: EMessageType.CHAT },
		],
	},
	{
		chatLogId: 5,
		messages: [
			{ messageLogId: 5, content: "Are you coming to the meeting?", senderId: 4, timestampInSeconds: Math.floor(new Date("2023-01-05T10:00:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 5, content: "Yes, I'll be there in 10 minutes.", senderId: 1, timestampInSeconds: Math.floor(new Date("2023-01-05T10:05:00Z").getTime() / 1000), type: EMessageType.CHAT },
		],
	},
	{
		chatLogId: 6,
		messages: [
			{ messageLogId: 6, content: "The project deadline is next week.", senderId: 7, timestampInSeconds: Math.floor(new Date("2023-01-06T10:00:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 6, content: "We need to speed up.", senderId: 6, timestampInSeconds: Math.floor(new Date("2023-01-06T10:05:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 6, content: "I agree. Let's divide the tasks.", senderId: 1, timestampInSeconds: Math.floor(new Date("2023-01-06T10:10:00Z").getTime() / 1000), type: EMessageType.CHAT },
		],
	},
	{
		chatLogId: 7,
		messages: [
			{ messageLogId: 7, content: "Can you help me with this bug?", senderId: 5, timestampInSeconds: Math.floor(new Date("2023-01-07T10:00:00Z").getTime() / 1000), type: EMessageType.CHAT },
			{ messageLogId: 7, content: "Sure, let's look at it together.", senderId: 1, timestampInSeconds: Math.floor(new Date("2023-01-07T10:05:00Z").getTime() / 1000), type: EMessageType.CHAT },
		],
	},
];
