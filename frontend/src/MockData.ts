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
			{ text: "Hey, how are you?", idSender: 1 },
			{ text: "I'm good, thanks! How about you?", idSender: 2 },
		],
		users: [1, 2],
	},
	{
		id: 2,
		type: EChatType.GROUP,
		avatar: "",
		name: "Volleyball Group Chat",
		messages: [
			{ text: "Hello everyone!", idSender: 3 },
			{ text: "Hi!", idSender: 4 },
			{ text: "Hey!", idSender: 5 },
		],
		users: [3, 4, 5],
	},
	{
		id: 3,
		type: EChatType.DIRECT,
		avatar: "",
		name: "Direct Chat 2",
		messages: [
			{ text: "Did you finish the task?", idSender: 6 },
			{ text: "Yes, I just submitted it.", idSender: 7 },
		],
		users: [6, 7],
	},
	{
		id: 4,
		type: EChatType.GROUP,
		avatar: "",
		name: "Group Chat 1",
		messages: [
			{ text: "Let's meet at 5pm", idSender: 1 },
			{ text: "Sounds good!", idSender: 3 },
			{ text: "I'll be there.", idSender: 5 },
		],
		users: [1, 3, 5],
	},
	{
		id: 5,
		type: EChatType.DIRECT,
		avatar: "",
		name: "Direct Chat 3",
		messages: [
			{ text: "Are you coming to the meeting?", idSender: 4 },
			{ text: "Yes, I'll be there in 10 minutes.", idSender: 2 },
		],
		users: [4, 2],
	},
	{
		id: 6,
		type: EChatType.GROUP,
		avatar: "",
		name: "Group Chat 2",
		messages: [
			{ text: "The project deadline is next week.", idSender: 7 },
			{ text: "We need to speed up.", idSender: 6 },
			{ text: "I agree. Let's divide the tasks.", idSender: 1 },
		],
		users: [7, 6, 1],
	},
	{
		id: 7,
		type: EChatType.DIRECT,
		avatar: "",
		name: "Direct Chat 4",
		messages: [
			{ text: "Can you help me with this bug?", idSender: 5 },
			{ text: "Sure, let's look at it together.", idSender: 3 },
		],
		users: [5, 3],
	},
];
