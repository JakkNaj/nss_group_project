import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { ChatStore, State } from "../../../context/ChatStore.ts";

const Styled = {
	ChatHeader: styled("div")({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottom: "0.0625rem solid #000",
		height: "5.4rem",
		padding: "0 2rem",
	}),
	AvatarLayout: styled("div")({
		display: "flex",
		alignItems: "center",
		gap: "1rem",
	}),
	Username: styled("span")({
		fontSize: "1.2rem",
		fontFamily: "Zilla Slab, sans-serif",
		fontWeight: "semi-bold",
	}),
	Status: styled("span")({
		fontSize: "0.8rem",
		color: "#808080",
	}),
	MoreIcon: styled(MoreVertIcon)({
		fontSize: "1.5rem",
	}),
	UsernameStatusLayout: styled("div")({
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
	}),
};

type ChatHeaderProps = {
	toggleRightSection: () => void;
};

export const ChatHeader = (props: ChatHeaderProps) => {
	const { activeChat } = ChatStore.useStore((state: State) => ({
		activeChat: state.activeChat,
	}));
	console.log(activeChat);

	if (!activeChat) {
		return <div>Error: No active chat found.</div>;
	}

	return (
		<Styled.ChatHeader>
			<Styled.AvatarLayout>
				<UserAvatar username={activeChat.name} photoUrl={activeChat?.avatar} />
				<Styled.UsernameStatusLayout>
					<Styled.Username>{activeChat?.name}</Styled.Username>
					<Styled.Status>online 7m ago</Styled.Status>
				</Styled.UsernameStatusLayout>
			</Styled.AvatarLayout>
			<Styled.MoreIcon onClick={props.toggleRightSection} />
		</Styled.ChatHeader>
	);
};
