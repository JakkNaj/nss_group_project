import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import { StyledInputField } from "../chat/list/SearchField.tsx";
import InputAdornment from "@mui/material/InputAdornment";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { colors } from "../../styles/colors.ts";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

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
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setEmailError("");
		setPasswordError("");

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address.");
			return;
		}

		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match.");
			return;
		}

		//todo send http request to backend, then on answer navigate to chat
		navigate("/chat");
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
			<Styled.SubmitButton variant="contained" type="submit" onClick={handleLogin}>
				Register
			</Styled.SubmitButton>
			<Styled.P>
				Already have an account?
				<Styled.RegisterLink to="/">Login here</Styled.RegisterLink>
			</Styled.P>
		</Styled.Form>
	);
};
