import React, {useEffect, useState} from "react";
import { UserStore } from "../../../../stores/UserStore.ts";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { StyledInputField } from "../../list/SearchField.tsx";
import { colors } from "../../../../styles/colors.ts";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { CircularProgress } from "@mui/material";
import {mapResponseToUserType} from "../../../../model/types/UserType.ts";
import {fetchWithTokens} from "../../../../FetchWithTokens.ts";

const Styled = {
	EditProfileContainer: styled("div")({
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		paddingLeft: "4rem",
		paddingTop: "2rem",
		paddingBottom: "2rem",
		height: "100%",
	}),
	UserAvatar: styled(UserAvatar)({
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
	UploadForm: styled("form")({
		display: "flex",
		flexDirection: "row",
		gap: "1.5rem",
		alignItems: "center",
		justifyContent: "flex-start",
		width: "100%",
		marginBottom: "1rem",
	}),
};

interface EditProfileProps {
	handleCancel: () => void;
}

export const EditProfile = (props: EditProfileProps) => {
	const [editedUsername, setEditedUsername] = useState("");
	const [editedName, setEditedName] = useState("");
	const [editedEmail, setEditedEmail] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [uploadErrorMessage, setUploadErrorMessage] = useState("");
	const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
	const [usernameError, setUsernameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [nameError, setNameError] = useState("");

	const loggedInUser = UserStore.useStore((state) => state.loggedInUser);

	useEffect(() => {
		if (loggedInUser) {
			setEditedUsername(loggedInUser.username);
			setEditedName(loggedInUser.name);
			setEditedEmail(loggedInUser.email);
		}
	}, [loggedInUser]);

	// If loggedInUser is null, return a message or a different component
	if (!loggedInUser) {
		return <p>No user is currently logged in.</p>;
	}

	const { id, username, name, email, avatar } = loggedInUser;

	const handleUpdateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoadingDetails(true);

		setUsernameError("");
		setNameError("");
		setEmailError("");

		const nameRegex = /^[a-zA-Z]+\s[a-zA-Z]+$/;
		if (!nameRegex.test(editedName)) {
			setNameError("Please enter a valid name and surname with space in between them.");
			setIsLoadingDetails(false);
			return;
		}

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailRegex.test(editedEmail)) {
			setEmailError("Please enter a valid email address.");
			setIsLoadingDetails(false);
			return;
		}

		if (!editedUsername) {
			setUsernameError("Username cannot be empty.");
			setIsLoadingDetails(false);
			return;
		}

		if (editedUsername !== username || editedName !== name || editedEmail !== email) {
			const userEntityDto = {
				userId: id,
				name: editedName,
				username: editedUsername,
				email: editedEmail,
				accountState: "ACTIVE",
			};

			try {
				const response = await fetchWithTokens("http://localhost:8085/users", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						// include auth tokens
					},
					body: JSON.stringify(userEntityDto),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(`${errorData.message}`);
				}

				const responseJson = await response.json();
				const updatedUser = mapResponseToUserType(responseJson);
				console.warn("Updated user:", updatedUser);
				UserStore.updateLoggedInUser(updatedUser);
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
		setIsLoadingDetails(false);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null) {
			setUploadErrorMessage("No file selected");
			return;
		}

		const file = event.target.files[0];
		if (!file) {
			setUploadErrorMessage("No file selected");
			return;
		}

		if (file.size > 2 * 1024 * 1024) {
			// 2MB
			setUploadErrorMessage("File is too large");
			return;
		}

		if (!file.type.startsWith("image/")) {
			setUploadErrorMessage("File is not an image");
			return;
		}

		setUploadErrorMessage("");
		setSelectedFile(file);
	};

	const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoadingAvatar(true);

		if (!selectedFile) {
			setUploadErrorMessage("No file selected");
			setIsLoadingAvatar(false);
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const response = await fetchWithTokens(`http://localhost:8085/users/${id}/profilePhoto`, {
				method: "POST",
				body: formData,
				// include auth tokens
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`${errorData.message}`);
			}

			const base64Image = await response.text();
			// Update the avatar
			UserStore.updateLoggedInUserAvatar(base64Image);
			setUploadSuccessMessage("Profile picture uploaded successfully!");
		} catch (error) {
			if (error instanceof Error) {
				setUploadErrorMessage(error.message);
				console.error("Failed to upload profile picture:", error);
			} else {
				console.error("An unknown error occurred:", error);
			}
		}

		setIsLoadingAvatar(false);
	};

	return (
		<Styled.EditProfileContainer>
			<Styled.UserAvatar name={username} avatar={avatar} width={6} />

			<h4>Edit Profile Picture</h4>
			<Styled.UploadForm onSubmit={handleFileUpload}>
				<StyledInputField.TextField
					type="file"
					variant="outlined"
					error={!!uploadErrorMessage}
					helperText={uploadErrorMessage}
					onChange={handleFileChange}
				/>
				<Styled.Button variant="contained" type="submit">
					Upload Picture
				</Styled.Button>
				{isLoadingAvatar && <CircularProgress style={{ color: `${colors.darkerBackground}` }} />}
			</Styled.UploadForm>
			{uploadSuccessMessage && <p>{uploadSuccessMessage}</p>}

			<h4>Edit Profile Information</h4>
			<Styled.Form onSubmit={handleUpdateDetails}>
				<StyledInputField.TextField
					label="Name"
					fullWidth
					value={editedName}
					onChange={(e) => setEditedName(e.target.value)}
					error={!!nameError}
					helperText={nameError}
				/>
				<StyledInputField.TextField
					label="Username"
					fullWidth
					value={editedUsername}
					onChange={(e) => setEditedUsername(e.target.value)}
					error={!!usernameError}
					helperText={usernameError}
				/>
				<StyledInputField.TextField
					label="Email"
					fullWidth
					value={editedEmail}
					onChange={(e) => setEditedEmail(e.target.value)}
					error={!!emailError}
					helperText={emailError}
				/>
				{isLoadingDetails && <CircularProgress style={{ color: `${colors.darkerBackground}` }} />}
				{successMessage && <p>{successMessage}</p>}
				{errorMessage && <p>{errorMessage}</p>}
				<Styled.Button variant="contained" type="submit">
					Update Details
				</Styled.Button>
			</Styled.Form>
			<Styled.Button onClick={props.handleCancel} variant="contained">
				Go back to profile details
			</Styled.Button>
		</Styled.EditProfileContainer>
	);
};
