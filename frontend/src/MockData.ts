import { EChatType } from "./model/enums/EChatType";
import { ChatRoomType } from "./model/types/ChatRoomType.ts";
import { UserType } from "./model/types/UserType.ts";

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
];

export const chatsData: ChatRoomType[] = [
	{
		id: 1,
		type: EChatType.ONE_ON_ONE,
		avatar: "",
		name: "Direct Chat 1",
		messages: [
			{ content: "Hey, how are you?", idSender: 1, timestamp: new Date("2023-01-01T10:00:00Z") },
			{ content: "I'm good, thanks! How about you?", idSender: 2, timestamp: new Date("2023-01-01T10:05:00Z") },
		],
		members: [1, 2],
	},
	{
		id: 2,
		type: EChatType.GROUP,
		avatar: "",
		name: "Volleyball Group Chat",
		messages: [
			{ content: "Hello everyone!", idSender: 3, timestamp: new Date("2023-01-02T10:00:00Z") },
			{ content: "Hi!", idSender: 4, timestamp: new Date("2023-01-02T10:05:00Z") },
			{ content: "Hey!", idSender: 1, timestamp: new Date("2023-01-02T10:10:00Z") },
		],
		members: [3, 4, 1],
	},
	{
		id: 3,
		type: EChatType.ONE_ON_ONE,
		avatar: "",
		name: "Direct Chat 2",
		messages: [
			{ content: "Did you finish the task?", idSender: 6, timestamp: new Date("2023-01-03T10:00:00Z") },
			{ content: "Yes, I just submitted it.", idSender: 1, timestamp: new Date("2023-01-03T10:05:00Z") },
		],
		members: [6, 1],
	},
	{
		id: 4,
		type: EChatType.GROUP,
		avatar: "",
		name: "Group Chat 1",
		messages: [
			{ content: "Let's meet at 5pm", idSender: 1, timestamp: new Date("2023-01-04T10:00:00Z") },
			{ content: "Sounds good!", idSender: 3, timestamp: new Date("2023-01-04T10:05:00Z") },
			{ content: "I'll be there.", idSender: 5, timestamp: new Date("2023-01-04T10:10:00Z") },
		],
		members: [1, 3, 5],
	},
	{
		id: 5,
		type: EChatType.ONE_ON_ONE,
		avatar: "",
		name: "Direct Chat 3",
		messages: [
			{ content: "Are you coming to the meeting?", idSender: 4, timestamp: new Date("2023-01-05T10:00:00Z") },
			{ content: "Yes, I'll be there in 10 minutes.", idSender: 1, timestamp: new Date("2023-01-05T10:05:00Z") },
		],
		members: [4, 1],
	},
	{
		id: 6,
		type: EChatType.GROUP,
		avatar: "",
		name: "Group Chat 2",
		messages: [
			{ content: "The project deadline is next week.", idSender: 7, timestamp: new Date("2023-01-06T10:00:00Z") },
			{ content: "We need to speed up.", idSender: 6, timestamp: new Date("2023-01-06T10:05:00Z") },
			{ content: "I agree. Let's divide the tasks.", idSender: 1, timestamp: new Date("2023-01-06T10:10:00Z") },
		],
		members: [7, 6, 1],
	},
	{
		id: 7,
		type: EChatType.ONE_ON_ONE,
		avatar: "",
		name: "Direct Chat 4",
		messages: [
			{ content: "Can you help me with this bug?", idSender: 5, timestamp: new Date("2023-01-07T10:00:00Z") },
			{ content: "Sure, let's look at it together.", idSender: 1, timestamp: new Date("2023-01-07T10:05:00Z") },
		],
		members: [5, 1],
	},
];
