import { UserStore } from "../../../stores/UserStore.ts";
import styled from "styled-components";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { colors } from "../../../styles/colors.ts";
import Button from "@mui/material/Button";
import { useState } from "react";
import { StyledInputField } from "../list/SearchField.tsx";

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
	Form: styled("form")({
		display: "flex",
		flexDirection: "column",
		gap: "1.5rem",
		alignItems: "center",
		justifyContent: "center",
		maxWidth: "400px",
		width: "100%",
	}),
};

export const ProfileWindow = () => {
	const { username, name, email, avatar } = UserStore.useStore((state) => ({
		username: state.loggedInUser.name,
		name: state.loggedInUser.username,
		email: state.loggedInUser.email,
		avatar: state.loggedInUser.avatar,
	}));

	const [isEditing, setIsEditing] = useState(false);
	const [editedUsername, setEditedUsername] = useState(username);
	const [editedName, setEditedName] = useState(name);
	const [editedEmail, setEditedEmail] = useState(email);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleEditProfile = () => {
		setIsEditing(true);
	};

	const handleUpdateDetails = async () => {
		if (editedUsername !== username || editedName !== name || editedEmail !== email) {
			const userEntityDto = {
				userId: UserStore.getLoggedInUser().id,
				name: editedName,
				username: editedUsername,
				email: editedEmail,
				accountState: "ACTIVE",
			};

			try {
				const response = await fetch("http://localhost:8081/users", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						// include auth tokens
					},
					body: JSON.stringify(userEntityDto),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
				}

				setIsEditing(false);
				setSuccessMessage("Profile updated successfully!");
			} catch (error) {
				if (error instanceof Error) {
					setErrorMessage(error.message);
					console.error("Failed to update user details:", error);
				} else {
					console.error("An unknown error occurred:", error);
				}
			}
		}
	};

	return (
		<Styled.ProfileWindowContainer>
			<Styled.UserAvatar name={username} avatar={avatar} width={6} />
			<Styled.SectionTitle>Profile details:</Styled.SectionTitle>
			{isEditing ? (
				<Styled.Form>
					<StyledInputField.TextField
						label="Username"
						fullWidth
						value={editedUsername}
						onChange={(e) => setEditedUsername(e.target.value)}
					/>
					<StyledInputField.TextField label="Name" fullWidth value={editedName} onChange={(e) => setEditedName(e.target.value)} />
					<StyledInputField.TextField
						label="Email"
						fullWidth
						value={editedEmail}
						onChange={(e) => setEditedEmail(e.target.value)}
					/>
					<Styled.Button onClick={handleUpdateDetails} variant="contained">
						Update Details
					</Styled.Button>
					{errorMessage && <p>{errorMessage}</p>}
				</Styled.Form>
			) : (
				<>
					<Styled.Username>{username}</Styled.Username>
					<Styled.Name>{name}</Styled.Name>
					<Styled.Email>{email}</Styled.Email>
					{successMessage && <p>{successMessage}</p>}
					<Styled.Button onClick={handleEditProfile} variant="contained">
						Edit Profile
					</Styled.Button>
				</>
			)}
			<Styled.Button onClick={handleEditProfile} variant="contained">
				Upload Profile picture
			</Styled.Button>
		</Styled.ProfileWindowContainer>
	);
};
