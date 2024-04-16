import styled from "styled-components";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { UserStore } from "../../../stores/UserStore.ts";
import AccountMenu from "./AccountMenu.tsx";
import { useNavigate } from "react-router-dom";

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
	const { username, avatar } = UserStore.useStore((state) => ({
		username: state.loggedInUser.name,
		avatar: state.loggedInUser.avatar,
	}));

	const handleAccountClick = () => {
		console.log("clicked on account");
		showProfileWindow();
	};

	const navigate = useNavigate();
	const handleLogoutClick = () => {
		console.log("clicked on logout");
		UserStore.reset();
		navigate("/"); //navigate to login page
	};

	return (
		<Styled.HeaderLayout>
			<Styled.Heading>Retro Chat : Messages</Styled.Heading>
			<Styled.AvatarLayout>
				<Styled.Username>{username}</Styled.Username>
				<UserAvatar username={username} avatar={avatar} />
				<AccountMenu onAccountClick={handleAccountClick} onLogoutClick={handleLogoutClick} />
			</Styled.AvatarLayout>
		</Styled.HeaderLayout>
	);
};
