import React, { useState } from "react";
import { UserStore } from "../../../../stores/UserStore.ts";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { StyledInputField } from "../../list/SearchField.tsx";
import { colors } from "../../../../styles/colors.ts";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";

const Styled = {
	EditProfileContainer: styled("div")({
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
	const { username, name, email, avatar } = UserStore.useStore((state) => ({
		username: state.loggedInUser.name,
		name: state.loggedInUser.username,
		email: state.loggedInUser.email,
		avatar: state.loggedInUser.avatar,
	}));

	const [editedUsername, setEditedUsername] = useState(username);
	const [editedName, setEditedName] = useState(name);
	const [editedEmail, setEditedEmail] = useState(email);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [uploadErrorMessage, setUploadErrorMessage] = useState("");
	const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");

	const handleUpdateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

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

		if (!selectedFile) {
			setUploadErrorMessage("No file selected for upload");
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const response = await fetch(`http://localhost:8081/users/${UserStore.getLoggedInUser().id}/profilePhoto`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
			}

			const data = await response.text();
			UserStore.updateLoggedInUserAvatar(data);

			setUploadSuccessMessage("Profile picture uploaded successfully");
		} catch (error) {
			setUploadErrorMessage("Failed to upload profile picture");
		}
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
			</Styled.UploadForm>
			{uploadSuccessMessage && <p>{uploadSuccessMessage}</p>}

			<h4>Edit Profile Information</h4>
			<Styled.Form onSubmit={handleUpdateDetails}>
				<StyledInputField.TextField
					label="Username"
					fullWidth
					value={editedUsername}
					onChange={(e) => setEditedUsername(e.target.value)}
				/>
				<StyledInputField.TextField label="Name" fullWidth value={editedName} onChange={(e) => setEditedName(e.target.value)} />
				<StyledInputField.TextField label="Email" fullWidth value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
				{successMessage && <p>{successMessage}</p>}
				{errorMessage && <p>{errorMessage}</p>}
				<Styled.Button variant="contained" type="submit">
					Update Details
				</Styled.Button>
			</Styled.Form>

			<Styled.Button onClick={props.handleCancel} variant="contained">
				Cancel
			</Styled.Button>
		</Styled.EditProfileContainer>
	);
};
