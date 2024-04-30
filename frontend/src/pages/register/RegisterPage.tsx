import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import { StyledInputField } from "../chat/list/SearchField.tsx";
import InputAdornment from "@mui/material/InputAdornment";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { colors } from "../../styles/colors.ts";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {UserStore} from "../../stores/UserStore.ts";
import PersonIcon from '@mui/icons-material/Person';
import {SignupDto} from "../../model/types/SignupDto.ts";
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

export const RegisterPage = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [nameError, setNameError] = useState("");
	const [serverError, setServerError] = useState("");

	const handleRegister = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setUsernameError("");
		setPasswordError("");
		setEmailError("")
		setNameError("");

		if (!username) {
			setUsernameError("Username cannot be empty.");
			return;
		}

		const nameRegex = /^[a-zA-Z]+\s[a-zA-Z]+$/;
		if (!nameRegex.test(name)) {
			setNameError("Please enter a valid name and surname with space in between them.");
			return;
		}

		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match.");
			return;
		}

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if(!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address.");
			return;
		}

		const credentials : SignupDto = {
			username: username,
			password: password,
			name: name,
			email: email,
		};

		try {
			const user = await UserStore.register(credentials);
			await ChatRoomStore.initializeStore(user.username);

			navigate("/chat");
		} catch (error) {
			console.error(error);
			setServerError((error as Error).message);
		}
	};



	return (
		<Styled.Form>
			<Styled.Heading>Register Here!</Styled.Heading>
			<StyledInputField.TextField
				variant="outlined"
				fullWidth
				label="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				error={!!emailError}
				helperText={emailError}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<MailIcon />
						</InputAdornment>
					),
				}}
			/>
			<StyledInputField.TextField
				variant="outlined"
				fullWidth
				label="Name + Surname"
				value={name}
				onChange={(e) => setName(e.target.value)}
				error={!!nameError}
				helperText={nameError}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<PersonIcon />
						</InputAdornment>
					),
				}}
			/>
			<StyledInputField.TextField
				variant="outlined"
				fullWidth
				label="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				error={!!usernameError}
				helperText={usernameError}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<PersonIcon />
						</InputAdornment>
					),
				}}
			/>
			<StyledInputField.TextField
				variant="outlined"
				fullWidth
				label="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				error={!!passwordError}
				helperText={passwordError}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<LockIcon />
						</InputAdornment>
					),
				}}
			/>
			<StyledInputField.TextField
				variant="outlined"
				fullWidth
				label="Confirm password"
				type="password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				error={!!passwordError}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<LockIcon />
						</InputAdornment>
					),
				}}
			/>
			{serverError && <p>{serverError}</p>}
			<Styled.SubmitButton variant="contained" type="submit" onClick={handleRegister}>
				Register
			</Styled.SubmitButton>
			<Styled.P>
				Already have an account?
				<Styled.RegisterLink to="/">Login here</Styled.RegisterLink>
			</Styled.P>
		</Styled.Form>
	);
};
