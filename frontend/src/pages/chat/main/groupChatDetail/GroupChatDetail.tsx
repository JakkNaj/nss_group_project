import styled from "styled-components";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { ChatRoomStore, State } from "../../../../stores/ChatRoomStore.ts";
import { GroupUserDetail } from "./GroupUserDetail.tsx";
import { UserType } from "../../../../model/types/UserType.ts";
import { colors } from "../../../../styles/colors.ts";
import { ChatNameWithIcon } from "./ChatNameWithIcon.tsx";
import CloseIcon from "@mui/icons-material/Close";
import {useEffect, useState} from "react";
import {useSendLeave} from "../../../../hooks/useSendLeave.tsx";

const Styled = {
	ProfileDetail: styled.section({
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		padding: "2rem",
		minWidth: "14rem",
	}),
	UserList: styled.section({
		width: "100%",
	}),
	UserListItem: styled.li({
		marginBottom: "1rem",
	}),
	ChatName: styled.h4({
		alignSelf: "center",
		marginTop: "1rem",
		fontSize: "1.5rem",
		marginBottom: "1rem",
	}),
	Avatar: styled(UserAvatar)({
		alignSelf: "center",
	}),
	LeaveButton: styled.button({
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

interface GroupChatProps {
	onBackClick: () => void;
	selectedGroupUser: UserType | null;
	setSelectedGroupUser: (user: UserType | null) => void;
}

export const GroupChatDetail = ({ onBackClick, selectedGroupUser, setSelectedGroupUser }: GroupChatProps) => {
	const [chatUsers, setChatUsers] = useState<UserType[]>([]);
	const { activeChat } = ChatRoomStore.useStore((state: State) => ({
		activeChat: state.activeChatRoom,
	}));

	const { sendLeave } = useSendLeave();

	useEffect(() => {
		const fetchUsers = async () => {
			if (activeChat) {
				const users = await ChatRoomStore.getChatUsers(activeChat.chatLogId);
				setChatUsers(users);
			}
		}
		fetchUsers();
	}, []);

	//this should not happen
	if (!activeChat) {
		return <div>Error: No active chat found.</div>;
	}

	//this should not happen
	if (!chatUsers) {
		return <div>Error: No other user in chat found.</div>;
	}

	const handleIconClick = (user: UserType) => {
		setSelectedGroupUser(user);
	};

	const handleBackClick = () => {
		setSelectedGroupUser(null);
	};

	const handleLeaveClick = () => {
		if (activeChat) {
			sendLeave({chatLogId: activeChat.chatLogId});
		}
	};

	return (
		<div>
			{selectedGroupUser ? (
				<GroupUserDetail user={selectedGroupUser} onBackClick={handleBackClick} />
			) : (
				<Styled.ProfileDetail>
					<Styled.CloseIcon onClick={onBackClick} />
					<Styled.Avatar name={activeChat.name} avatar={activeChat.avatar} width={7} />
					<Styled.ChatName>{activeChat.name}</Styled.ChatName>
					<Styled.UserList>
						{chatUsers.map((user) => (
							<ChatNameWithIcon key={user.id} name={user.name} onIconClick={() => handleIconClick(user)} />
						))}
					</Styled.UserList>
					<Styled.LeaveButton onClick={handleLeaveClick}>Leave Group</Styled.LeaveButton>
				</Styled.ProfileDetail>
			)}
		</div>
	);
};
