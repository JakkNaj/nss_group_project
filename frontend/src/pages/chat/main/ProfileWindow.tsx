import { UserStore } from "../../../stores/UserStore.ts";
import styled from "styled-components";
import { UserAvatar } from "../../../components/UserAvatar.tsx";

const Styled = {
	ProfileWindowContainer: styled("div")({
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		paddingLeft: "4rem",
		paddingTop: "2rem",
		height: "100%",
	}),
	UserAvatar: styled(UserAvatar)({
		marginBottom: "1rem",
	}),
};

export const ProfileWindow = () => {
	const { username, email, phoneNumber, avatar } = UserStore.useStore((state) => ({
		username: state.loggedInUser.name,
		email: state.loggedInUser.email,
		phoneNumber: state.loggedInUser.phoneNumber,
		avatar: state.loggedInUser.avatar,
	}));

	const handleEditProfile = () => {
		console.log("Edit profile clicked");
	};

	return (
		<Styled.ProfileWindowContainer>
			<Styled.UserAvatar username={username} avatar={avatar} width={6} />
			<h2>{username}</h2>
			<p>{email}</p>
			<p>{phoneNumber}</p>
			<button onClick={handleEditProfile}>Edit Profile</button>
			<button onClick={handleEditProfile}>Upload Profile picture</button>
		</Styled.ProfileWindowContainer>
	);
};
