import { colors } from "./styles/colors.ts";
import { ChatPage } from "./pages/chat/ChatPage.tsx";
import styled, { createGlobalStyle } from "styled-components";
import { LoginPage } from "./pages/login/LoginPage.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RegisterPage } from "./pages/register/RegisterPage.tsx";

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        text-align: center;
        font-family: 'Inter', sans-serif;
    }
`;

const Styled = {
	AppWrapper: styled.div`
		background-color: ${colors.lightBackground};
		border-radius: 1.4375rem;
		height: 100vh;
		border: 0.125rem solid black;
	`,
};

const App = () => {
	return (
		<>
			<GlobalStyle />
			<Styled.AppWrapper>
				<Router>
					<Routes>
						<Route path="/chat" element={<ChatPage />} />
						<Route path="/" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
					</Routes>
				</Router>
			</Styled.AppWrapper>
		</>
	);
};

export default App;
