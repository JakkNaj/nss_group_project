import styled from "styled-components";
import { useContext } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { UserContext } from "../../context/UserContext";
import { UserAvatar } from "../../components/UserAvatar.tsx";

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

export const ChatHeader = () => {
	const { username, photoUrl } = useContext(UserContext);

	return (
		<Styled.HeaderLayout>
			<Styled.Heading>Messages</Styled.Heading>
			<Styled.AvatarLayout>
				<Styled.Username>{username}</Styled.Username>
				<UserAvatar username={username} photoUrl={photoUrl} />
				<KeyboardArrowDownIcon />
			</Styled.AvatarLayout>
		</Styled.HeaderLayout>
	);
};
