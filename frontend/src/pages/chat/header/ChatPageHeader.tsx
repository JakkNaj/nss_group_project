import styled from "styled-components";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { UserStore } from "../../../stores/UserStore.ts";

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

export const ChatPageHeader = () => {
	const { username, avatar } = UserStore.useStore((state) => ({
		username: state.loggedInUser.name,
		avatar: state.loggedInUser.avatar,
	}));

	return (
		<Styled.HeaderLayout>
			<Styled.Heading>Messages</Styled.Heading>
			<Styled.AvatarLayout>
				<Styled.Username>{username}</Styled.Username>
				<UserAvatar username={username} avatar={avatar} />
				<KeyboardArrowDownIcon />
			</Styled.AvatarLayout>
		</Styled.HeaderLayout>
	);
};
