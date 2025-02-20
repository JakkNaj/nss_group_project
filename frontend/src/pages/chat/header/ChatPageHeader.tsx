import styled from "styled-components";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { UserStore } from "../../../stores/UserStore.ts";
import AccountMenu from "./AccountMenu.tsx";
import { useNavigate } from "react-router-dom";
import { ChatLogStore } from "../../../stores/ChatLogStore.ts";
import { ChatRoomStore } from "../../../stores/ChatRoomStore.ts";

const Styled = {
	HeaderLayout: styled("div")({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottom: "0.0625rem solid #000",
		height: "100%",
		padding: "0 2rem",
	}),

	Heading: styled("h2")({
		fontFamily: "Zilla Slab, sans-serif",
		fontSize: "1.6rem",
		fontWeight: "bold",
	}),
	AvatarLayout: styled("aside")({
		display: "flex",
		alignItems: "center",
		gap: "1rem",
	}),
	Username: styled("span")({
		fontSize: "1.2rem",
		fontFamily: "Zilla Slab, sans-serif",
		fontWeight: "semi-bold",
	}),
};

interface ChatPageHeaderProps {
	showProfileWindow: () => void;
}

export const ChatPageHeader = ({ showProfileWindow }: ChatPageHeaderProps) => {
	const { username, name, avatar } = UserStore.useStore((state) => {
		if (state.loggedInUser) {
			return {
				username: state.loggedInUser.username,
				avatar: state.loggedInUser.avatar,
				name: state.loggedInUser.name,
			};
		} else {
			//should not happen
			return {
				username: 'failed to load',
				avatar: '',
				name: 'error',
			};
		}
	});


	const handleAccountClick = () => {
		showProfileWindow();
	};

	const navigate = useNavigate();
	const handleLogoutClick = () => {
		UserStore.reset();
		ChatLogStore.reset();
		ChatRoomStore.reset();
		navigate("/"); //navigate to login page
	};

	return (
		<Styled.HeaderLayout>
			<Styled.Heading>Retro Chat : Messages</Styled.Heading>
			<Styled.AvatarLayout>
				<Styled.Username>{`${name} : ${username}`}</Styled.Username>
				<UserAvatar name={name} avatar={avatar} />
				<AccountMenu onAccountClick={handleAccountClick} onLogoutClick={handleLogoutClick} />
			</Styled.AvatarLayout>
		</Styled.HeaderLayout>
	);
};
