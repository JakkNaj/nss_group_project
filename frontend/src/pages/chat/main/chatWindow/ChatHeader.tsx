import styled from "styled-components";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { ChatRoomStore, State } from "../../../../stores/ChatRoomStore.ts";

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
		padding: "0.5rem",
		"&:hover": {
			backgroundColor: "rgba(0, 0, 0, 0.04)",
			borderRadius: "50%",
		},
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
	const { activeChatRoom } = ChatRoomStore.useStore((state: State) => ({
		activeChatRoom: state.activeChatRoom,
	}));

	if (!activeChatRoom) {
		return <div>Error: No active chat found.</div>;
	}

	return (
		<Styled.ChatHeader>
			<Styled.AvatarLayout>
				<UserAvatar name={activeChatRoom.name} avatar={""} />
				<Styled.UsernameStatusLayout>
					<Styled.Username>{activeChatRoom.name}</Styled.Username>
					<Styled.Status>online 7m ago</Styled.Status>
				</Styled.UsernameStatusLayout>
			</Styled.AvatarLayout>
			<Styled.MoreIcon onClick={props.toggleRightSection} />
		</Styled.ChatHeader>
	);
};
