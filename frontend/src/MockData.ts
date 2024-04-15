import { EChatType } from "./model/enums/EChatType";
import { ChatType } from "./model/types/ChatType.ts";
import { UserType } from "./model/types/UserType.ts";

export const usersData: UserType[] = [
	{
		id: 1,
		avatar: "",
		name: "Adam Auro",
		email: "adam.auro@example.com",
		phoneNumber: "123-456-7890",
	},
	{
		id: 2,
		avatar: "",
		name: "Jane Doe",
		email: "jane.doe@example.com",
		phoneNumber: "234-567-8901",
	},
	{
		id: 3,
		avatar: "",
		name: "Kristin Watson",
		email: "kristin.watson@example.com",
		phoneNumber: "345-678-9012",
	},
	{
		id: 4,
		avatar: "",
		name: "Dianne Russell",
		email: "dianne.russell@example.com",
		phoneNumber: "456-789-0123",
	},
	{
		id: 5,
		avatar: "",
		name: "Wade Warren",
		email: "wade.warren@example.com",
		phoneNumber: "567-890-1234",
	},
	{
		id: 6,
		avatar: "",
		name: "Tobias Le",
		email: "tobias.le@example.com",
		phoneNumber: "678-901-2345",
	},
	{
		id: 7,
		avatar: "",
		name: "Adam Schuppler",
		email: "adam.schuppler@example.com",
		phoneNumber: "789-012-3456",
	},
];

export const chatsData: ChatType[] = [
	{
		id: 1,
		type: EChatType.DIRECT,
		avatar: "",
		name: "Direct Chat 1",
		messages: [
			{ text: "Hey, how are you?", idSender: 1, id: 1, timestamp: new Date("2023-01-01T10:00:00Z") },
			{ text: "I'm good, thanks! How about you?", idSender: 2, id: 2, timestamp: new Date("2023-01-01T10:05:00Z") },
		],
		users: [1, 2],
	},
	{
		id: 2,
		type: EChatType.GROUP,
		avatar: "",
		name: "Volleyball Group Chat",
		messages: [
			{ text: "Hello everyone!", idSender: 3, id: 3, timestamp: new Date("2023-01-02T10:00:00Z") },
			{ text: "Hi!", idSender: 4, id: 4, timestamp: new Date("2023-01-02T10:05:00Z") },
			{ text: "Hey!", idSender: 1, id: 5, timestamp: new Date("2023-01-02T10:10:00Z") },
		],
		users: [3, 4, 1],
	},
	{
		id: 3,
		type: EChatType.DIRECT,
		avatar: "",
		name: "Direct Chat 2",
		messages: [
			{ text: "Did you finish the task?", idSender: 6, id: 6, timestamp: new Date("2023-01-03T10:00:00Z") },
			{ text: "Yes, I just submitted it.", idSender: 1, id: 7, timestamp: new Date("2023-01-03T10:05:00Z") },
		],
		users: [6, 1],
	},
	{
		id: 4,
		type: EChatType.GROUP,
		avatar: "",
		name: "Group Chat 1",
		messages: [
			{ text: "Let's meet at 5pm", idSender: 1, id: 8, timestamp: new Date("2023-01-04T10:00:00Z") },
			{ text: "Sounds good!", idSender: 3, id: 9, timestamp: new Date("2023-01-04T10:05:00Z") },
			{ text: "I'll be there.", idSender: 5, id: 10, timestamp: new Date("2023-01-04T10:10:00Z") },
		],
		users: [1, 3, 5],
	},
	{
		id: 5,
		type: EChatType.DIRECT,
		avatar: "",
		name: "Direct Chat 3",
		messages: [
			{ text: "Are you coming to the meeting?", idSender: 4, id: 11, timestamp: new Date("2023-01-05T10:00:00Z") },
			{ text: "Yes, I'll be there in 10 minutes.", idSender: 1, id: 12, timestamp: new Date("2023-01-05T10:05:00Z") },
		],
		users: [4, 1],
	},
	{
		id: 6,
		type: EChatType.GROUP,
		avatar: "",
		name: "Group Chat 2",
		messages: [
			{ text: "The project deadline is next week.", idSender: 7, id: 13, timestamp: new Date("2023-01-06T10:00:00Z") },
			{ text: "We need to speed up.", idSender: 6, id: 14, timestamp: new Date("2023-01-06T10:05:00Z") },
			{ text: "I agree. Let's divide the tasks.", idSender: 1, id: 15, timestamp: new Date("2023-01-06T10:10:00Z") },
		],
		users: [7, 6, 1],
	},
	{
		id: 7,
		type: EChatType.DIRECT,
		avatar: "",
		name: "Direct Chat 4",
		messages: [
			{ text: "Can you help me with this bug?", idSender: 5, id: 16, timestamp: new Date("2023-01-07T10:00:00Z") },
			{ text: "Sure, let's look at it together.", idSender: 1, id: 17, timestamp: new Date("2023-01-07T10:05:00Z") },
		],
		users: [5, 1],
	},
];
