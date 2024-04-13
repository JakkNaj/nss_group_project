import { ChatHeader } from "./ChatHeader.tsx";
import { ChatList } from "./list/ChatList.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";

const theme = createTheme({
	typography: {
		fontFamily: "Inter, sans-serif",
	},
});

const Styled = {
	ChatPageContainer: styled("div")({
		display: "grid",
		gridTemplateColumns: "2fr 4fr 1fr",
		gridTemplateRows: "1fr 14fr",
		gridTemplateAreas: `
            "header header header"
            "leftSection main rightSection"
        `,
		height: "100vh",
	}),
	Header: styled("header")({
		gridArea: "header",
		borderBottom: "0.0625rem solid black",
	}),
	LeftSection: styled("section")({
		gridArea: "leftSection",
		borderRight: "0.0625rem solid black",
	}),
	Main: styled("main")({
		gridArea: "main",
	}),
	RightSection: styled("aside")({
		gridArea: "rightSection",
		borderLeft: "0.0625rem solid black",
	}),
};

export const ChatPage = () => {
	return (
		<ThemeProvider theme={theme}>
			<Styled.ChatPageContainer>
				<Styled.Header>
					<ChatHeader />
				</Styled.Header>
				<Styled.LeftSection>
					<ChatList />
				</Styled.LeftSection>
				<Styled.Main>
					<h2>Main chat</h2>
				</Styled.Main>
				<Styled.RightSection>
					<h2>Users right section</h2>
				</Styled.RightSection>
			</Styled.ChatPageContainer>
		</ThemeProvider>
	);
};
