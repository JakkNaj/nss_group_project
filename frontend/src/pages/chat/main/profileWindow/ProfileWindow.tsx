import { UserStore } from "../../../../stores/UserStore.ts";
import styled from "styled-components";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { colors } from "../../../../styles/colors.ts";
import {useEffect, useState} from "react";
import { EditProfile } from "./EditProfile.tsx";
import Button from "@mui/material/Button";

const Styled = {
	ProfileWindowContainer: styled("div")({
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		paddingLeft: "60px",
		paddingTop: "2rem",
	}),
	UserAvatar: styled(UserAvatar)({
		marginBottom: "1rem",
	}),
	SectionTitle: styled("p")({
		marginTop: "0",
		fontWeight: "bold",
		color: `${colors.primaryText}`,
	}),
	Username: styled("h2")({
		fontFamily: "Zilla Slab",
		marginTop: "1rem",
		marginBottom: "0",
	}),
	Name: styled("h4")({
		marginBottom: "0",
	}),
	Email: styled("p")({
		marginBottom: "1rem",
	}),
	PhoneNum: styled("p")({
		marginBottom: "1rem",
	}),
	Button: styled(Button)({
		backgroundColor: `${colors.darkerBackground} !important`,
		color: `${colors.primaryText} !important`,
		fontFamily: "Zilla Slab, sans-serif !important",
		padding: "0.5rem 2rem !important",
		margin: "0.5rem 0 !important",
		alignSelf: "flex-start !important",
	}),
};

export const ProfileWindow = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [avatar, setAvatar] = useState("");
	const [username, setUsername] = useState("");

	const loggedInUser = UserStore.useStore((state) => state.loggedInUser);

	useEffect(() => {
		if (loggedInUser) {
			setAvatar(loggedInUser.avatar);
			setEmail(loggedInUser.email);
			setName(loggedInUser.name);
			setUsername(loggedInUser.username)
		}
	}, []);

	const [isEditing, setIsEditing] = useState(false);

	const handleEditProfile = () => {
		setIsEditing(true);
	};

	const cancelEdit = () => {
		setIsEditing(false);
	};

	return isEditing ? (
		<EditProfile handleCancel={cancelEdit} />
	) : (
		<Styled.ProfileWindowContainer>
			<Styled.UserAvatar name={username} avatar={avatar} width={6} />
			<Styled.SectionTitle>Profile details:</Styled.SectionTitle>
			<Styled.Username>{username}</Styled.Username>
			<Styled.Name>{name}</Styled.Name>
			<Styled.Email>{email}</Styled.Email>
			<Styled.Button onClick={handleEditProfile} variant="contained">
				Edit Profile
			</Styled.Button>
		</Styled.ProfileWindowContainer>
	);
};
