import MailIcon from "@mui/icons-material/Mail";
import { StyledInputField } from "../chat/list/SearchField.tsx";
import InputAdornment from "@mui/material/InputAdornment";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { colors } from "../../styles/colors.ts";
import { Link, useNavigate } from "react-router-dom";
import React, {useState} from "react";
import {UserStore} from "../../stores/UserStore.ts";
import {PasswordInput} from "../../components/PasswordInput.tsx";
import {ChatRoomStore} from "../../stores/ChatRoomStore.ts";

const Styled = {
	Form: styled("form")({
		display: "flex",
		flexDirection: "column",
		gap: "1.5rem",
		alignItems: "center",
		justifyContent: "center",
		margin: "auto",
		height: "80%",
		width: "80%",
		maxWidth: "400px",
	}),
	SubmitButton: styled(Button)({
		backgroundColor: `${colors.darkerBackground} !important`,
		color: `${colors.primaryText} !important`,
		marginTop: "1rem !important",
		fontFamily: "Zilla Slab, sans-serif !important",
		width: "100%",
	}),
	Heading: styled("h1")({
		fontFamily: "Zilla Slab, serif",
		fontSize: "2.5rem",
		color: colors.primaryText,
		marginBottom: "1rem",
	}),
	RegisterLink: styled(Link)({
		color: colors.btn,
		marginLeft: "0.5rem",
		fontFamily: "Zilla Slab, sans-serif",
	}),
	P: styled("p")({
		fontFamily: "Inter, sans-serif",
	}),
};

export const LoginPage = () => {
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [serverError, setServerError] = useState("");

	//only for testing until user management is ready
	const [id, setId] = useState(1);

	const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (!username) {
			setUsernameError("Username is required");
			return;
		} else if (username.length < 3) {
			setUsernameError("Username must be at least 3 characters long");
			return;
		}

		if (!password) {
			setPasswordError("Password is required");
			return;
		}

		try {
			//todo remove using mock data
			//const user = await UserStore.login(username, password);
			//await ChatRoomStore.initializeStore(user.username);
			//ChatRoomStore.initializeStoreWithMockData();
			UserStore.updateLoggedInUser({
				id: id,
				avatar: "",
				name: `Exam Ple0${id}`,
				email: "example@example.com",
				username: `${username}`,
				phoneNumber: "123-456-7890",
			})
			navigate("/chat");
		} catch (error) {
			console.error(error);
			setServerError((error as Error).message);
		}

	};

	return (
		<Styled.Form>
			<Styled.Heading>Retro Chat</Styled.Heading>
			<StyledInputField.TextField
				variant="outlined"
				fullWidth
				label="Username"
				onChange={e => setUsername(e.target.value)}
				error={!!usernameError}
				helperText={usernameError}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<MailIcon />
						</InputAdornment>
					),
				}}
			/>
			{/*only for testing before user management is ready */}
			<StyledInputField.TextField
				variant="outlined"
				fullWidth
				label="ID"
				onChange={e => setId(Number(e.target.value))}
			/>
			<PasswordInput setPassword={setPassword} passwordError={passwordError}/>
			{serverError && <p>{serverError}</p>}
			<Styled.SubmitButton variant="contained" type="submit" onClick={handleLogin}>
				Login
			</Styled.SubmitButton>
			<Styled.P>
				Don't have an account?
				<Styled.RegisterLink to="/register">Register here</Styled.RegisterLink>
			</Styled.P>
		</Styled.Form>
	);
};
