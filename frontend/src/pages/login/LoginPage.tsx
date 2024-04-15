import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import { StyledInputField } from "../chat/list/SearchField.tsx";
import InputAdornment from "@mui/material/InputAdornment";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { colors } from "../../styles/colors.ts";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

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

	const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		navigate("/chat");
	};

	return (
		<Styled.Form>
			<Styled.Heading>Retro Chat</Styled.Heading>
			<StyledInputField.TextField
				variant="outlined"
				fullWidth
				label="Email"
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
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<LockIcon />
						</InputAdornment>
					),
				}}
			/>
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
