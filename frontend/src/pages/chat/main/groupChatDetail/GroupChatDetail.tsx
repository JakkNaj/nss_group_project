import styled from "styled-components";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { ChatStore, State } from "../../../../stores/ChatStore.ts";
import { useState } from "react";
import { GroupUserDetail } from "./GroupUserDetail.tsx";
import { UserType } from "../../../../model/types/UserType.ts";
import { colors } from "../../../../styles/colors.ts";
import { ChatNameWithIcon } from "./ChatNameWithIcon.tsx";
import CloseIcon from "@mui/icons-material/Close";

const Styled = {
	ProfileDetail: styled.section`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 2rem;
		min-width: 14rem;
	`,
	UserList: styled.section`
		width: 100%;
	`,
	UserListItem: styled.li`
		margin-bottom: 1rem;
	`,
	ChatName: styled.h4`
		align-self: center;
		margin-top: 1rem;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	`,
	Avatar: styled(UserAvatar)`
		align-self: center;
	`,
	LeaveButton: styled.button`
		margin-top: 2rem;
		padding: 0.5rem 1rem;
		background-color: ${colors.lightBackground};
		font-size: 1rem;
		cursor: pointer;
		border-radius: 0.6rem;
		border: 0.0625rem solid #000;
		box-shadow: 0.11578125rem 0.11578125rem 0 0 #000;
	`,
	CloseIcon: styled(CloseIcon)`
		cursor: pointer;
		position: absolute;
	`,
};

interface GroupChatProps {
	onBackClick: () => void;
}

export const GroupChatDetail = ({ onBackClick }: GroupChatProps) => {
	const { activeChat } = ChatStore.useStore((state: State) => ({
		activeChat: state.activeChat,
	}));

	//this should not happen
	if (!activeChat) {
		return <div>Error: No active chat found.</div>;
	}

	const otherUsers = ChatStore.getChatUsers(activeChat.id);

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
