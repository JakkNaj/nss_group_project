import styled from "styled-components";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { ChatRoomStore, State } from "../../../../stores/ChatRoomStore.ts";
import { useState } from "react";
import { GroupUserDetail } from "./GroupUserDetail.tsx";
import { UserType } from "../../../../model/types/UserType.ts";
import { colors } from "../../../../styles/colors.ts";
import { ChatNameWithIcon } from "./ChatNameWithIcon.tsx";
import CloseIcon from "@mui/icons-material/Close";

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
}

export const GroupChatDetail = ({ onBackClick }: GroupChatProps) => {
	const { activeChat } = ChatRoomStore.useStore((state: State) => ({
		activeChat: state.activeChatRoom,
	}));

	//this should not happen
	if (!activeChat) {
		return <div>Error: No active chat found.</div>;
	}

	const otherUsers = ChatRoomStore.getChatUsers(activeChat.chatLogId);

	//this should not happen
	if (!otherUsers) {
		return <div>Error: No other user in chat found.</div>;
	}

	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const handleIconClick = (user: UserType) => {
		setSelectedUser(user);
	};

	const handleBackClick = () => {
		setSelectedUser(null);
	};

	const handleRemoveClick = () => {
		// logic to remove the user from the group
	};

	const handleLeaveClick = () => {
		// logic to remove the current user from the group
	};

	return (
		<div>
			{selectedUser ? (
				<GroupUserDetail user={selectedUser} onBackClick={handleBackClick} onRemoveClick={handleRemoveClick} />
			) : (
				<Styled.ProfileDetail>
					<Styled.CloseIcon onClick={onBackClick} />
					<Styled.Avatar username={activeChat.name} avatar={activeChat.avatar} width={7} />
					<Styled.ChatName>{activeChat.name}</Styled.ChatName>
					<Styled.UserList>
						{otherUsers.map((user) => (
							<ChatNameWithIcon key={user.id} name={user.name} onIconClick={() => handleIconClick(user)} />
						))}
					</Styled.UserList>
					<Styled.LeaveButton onClick={handleLeaveClick}>Leave Group</Styled.LeaveButton>
				</Styled.ProfileDetail>
			)}
		</div>
	);
};
