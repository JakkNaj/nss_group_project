import styled from "styled-components";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { ChatRoomStore, State } from "../../../../stores/ChatRoomStore.ts";
import { colors } from "../../../../styles/colors.ts";
import { UserStore } from "../../../../stores/UserStore.ts";
import CloseIcon from "@mui/icons-material/Close";
import {useEffect, useState} from "react";
import {BlockStore} from "../../../../stores/BlockStore.ts";
import {UserType} from "../../../../model/types/UserType.ts";

const Styled = {
	ProfileDetail: styled.section({
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		padding: "2rem",
		minWidth: "14rem",
	}),
	Avatar: styled(UserAvatar)({
		alignSelf: "center",
	}),
	ChatName: styled.h4({
		alignSelf: "center",
		marginTop: "1rem",
		fontSize: "1.5rem",
		marginBottom: "1rem",
	}),
	Email: styled.p({
		marginTop: "1rem",
		fontSize: "1rem",
		borderBottom: "0.0625rem solid black",
		paddingBottom: "1rem",
		color: colors.greyText,
		width: "100%",
		textAlign: "left",
	}),
	Telephone: styled.p({
		marginTop: "0.5rem",
		fontSize: "1rem",
		borderBottom: "0.0625rem solid black",
		paddingBottom: "1rem",
		color: colors.greyText,
		width: "100%",
		textAlign: "left",
	}),
	SectionName: styled.span({
		fontSize: "1rem",
		marginTop: "1.5rem",
	}),
	BlockButton: styled.button({
		marginTop: "2rem",
		padding: "0.5rem 1rem",
		backgroundColor: colors.lightBackground,
		fontSize: "1rem",
		cursor: "pointer",
		borderRadius: "0.6rem",
		border: "0.0625rem solid #000",
		boxShadow: "0.11578125rem 0.11578125rem 0 0 #000",
	}),
	CloseIcon: styled(CloseIcon)({
		cursor: "pointer",
		position: "absolute",
	}),
};

interface DirectChatProps {
	onBackClick: () => void;
}

export const DirectChatDetail = ({ onBackClick }: DirectChatProps) => {
	const [loggedInUserId, setloggedInUserId] = useState<number>(-1);
	const [chatUsers, setChatUsers] = useState<UserType[]>([]);
	const { activeChat } = ChatRoomStore.useStore((state: State) => ({
		activeChat: state.activeChatRoom,
	}));
	const user = UserStore.useStore((state) => state.loggedInUser);

	useEffect(() => {
		if (user) {
			setloggedInUserId(user.id);
		}
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			if (activeChat){
				const users = await ChatRoomStore.getChatUsers(activeChat.chatLogId);
				setChatUsers(users);
			}
		}
		fetchUsers();
	}, [activeChat?.chatLogId]);

	//this should not happen
	if (!activeChat) {
		return <div>Error: No active chat found.</div>;
	} else if (!(loggedInUserId >= 0)) {
		return <div>Error: no user logged in.</div>;
	}

	//this should not happen
	if (!chatUsers) {
		return <div>Error: No users in chat found.</div>;
	}

	//this should not happen
	if (!UserStore.getLoggedInUser()) {
		return <div>Error: No logged-in user found.</div>;
	}

	const otherUser = chatUsers.filter((user) => user.id !== loggedInUserId)[0];

	if (!otherUser) {
		return <div>Error: No other user in chat found.</div>;
	}

	const isBlocked = BlockStore.isBlocked(otherUser.username);

	const handleBlockClick = () => {
		if (isBlocked) {
			console.log("Blocking user with id: ", otherUser.id);
			BlockStore.unblockUser(otherUser.username);
		} else {
			console.log("Unblocking user with id: ", otherUser.id);
			BlockStore.blockUser(otherUser.username);
		}
	};

	return (
		<Styled.ProfileDetail>
			<Styled.CloseIcon onClick={onBackClick} />
			<Styled.Avatar name={otherUser.name} avatar={otherUser.avatar} width={7} />
			<Styled.ChatName>{otherUser.name}</Styled.ChatName>
			<Styled.SectionName>Email</Styled.SectionName>
			<Styled.Email>{otherUser.email}</Styled.Email>
			<Styled.SectionName>Phone number</Styled.SectionName>
			<Styled.Telephone>{otherUser.phoneNumber}</Styled.Telephone>
			<Styled.BlockButton onClick={handleBlockClick}>
				{isBlocked? "Unblock " : "Block "}{otherUser.name}
			</Styled.BlockButton>
		</Styled.ProfileDetail>
	);
};
