import { ChatPageHeader } from "./header/ChatPageHeader.tsx";
import { ChatList } from "./list/ChatList.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";
import { ChatWindow } from "./main/ChatWindow.tsx";

const theme = createTheme({
	typography: {
		fontFamily: "Inter, sans-serif",
	},
});

const Styled = {
	ChatPageContainer: styled("div")({
		display: "grid",
		gridTemplateColumns: "2fr 4fr",
		gridTemplateRows: "1fr 14fr",
		gridTemplateAreas: `
            "header header"
            "leftSection main"
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
};

export const ChatPage = () => {
	return (
		<ThemeProvider theme={theme}>
			<Styled.ChatPageContainer>
				<Styled.Header>
					<ChatPageHeader />
				</Styled.Header>
				<Styled.LeftSection>
					<ChatList />
				</Styled.LeftSection>
				<Styled.Main>
					<ChatWindow />
				</Styled.Main>
			</Styled.ChatPageContainer>
		</ThemeProvider>
	);
};
