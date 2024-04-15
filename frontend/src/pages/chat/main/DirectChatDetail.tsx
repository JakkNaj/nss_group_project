import styled from "styled-components";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { ChatStore, State } from "../../../stores/ChatStore.ts";
import { colors } from "../../../styles/colors.ts";
import { UserStore } from "../../../stores/UserStore.ts";
import CloseIcon from "@mui/icons-material/Close";

const Styled = {
	ProfileDetail: styled.section`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 2rem;
		min-width: 14rem;
	`,
	Avatar: styled(UserAvatar)`
		align-self: center;
	`,
	ChatName: styled.h4`
		align-self: center;
		margin-top: 1rem;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	`,
	Email: styled.p`
		margin-top: 1rem;
		font-size: 1rem;
		border-bottom: 0.0625rem solid black;
		padding-bottom: 1rem;
		color: ${colors.greyText};
		width: 100%;
		text-align: left;
	`,
	Telephone: styled.p`
		margin-top: 0.5rem;
		font-size: 1rem;
		border-bottom: 0.0625rem solid black;
		padding-bottom: 1rem;
		color: ${colors.greyText};
		width: 100%;
		text-align: left;
	`,
	SectionName: styled.span`
		font-size: 1rem;
		margin-top: 1.5rem;
	`,
	BlockButton: styled.button`
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

interface DirectChatProps {
	onBackClick: () => void;
}

export const DirectChatDetail = ({ onBackClick }: DirectChatProps) => {
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

	//this should not happen
	if (!UserStore.getLoggedInUser()) {
		return <div>Error: No logged-in user found.</div>;
	}

	const otherUser = otherUsers.filter((user) => user.id !== UserStore.getLoggedInUser().id)[0];

	if (!otherUsers) {
		return <div>Error: No other user in chat found.</div>;
	}

	return (
		<Styled.ProfileDetail>
			<Styled.CloseIcon onClick={onBackClick} />
			<Styled.Avatar username={otherUser.name} avatar={otherUser.avatar} width={7} />
			<Styled.ChatName>{otherUser.name}</Styled.ChatName>
			<Styled.SectionName>Email</Styled.SectionName>
			<Styled.Email>{otherUser.email}</Styled.Email>
			<Styled.SectionName>Phone number</Styled.SectionName>
			<Styled.Telephone>{otherUser.phoneNumber}</Styled.Telephone>
			<Styled.BlockButton>{"Block " + otherUser.name}</Styled.BlockButton>
		</Styled.ProfileDetail>
	);
};
