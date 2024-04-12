import {colors} from "./styles/colors.ts";
import {ChatPage} from "./pages/chat/ChatPage.tsx";
import styled, { createGlobalStyle } from 'styled-components';
import {UserProvider} from "./context/UserContext.tsx";

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        text-align: center;
        font-family: 'Inter', sans-serif;
    }
`;

const AppWrapper = styled.div`
    background-color: ${colors.lightBackground};
    border-radius: 23px;
    height: 100vh;
    border: 2px solid black;
`;

const App: React.FC = () => {

    const user = {
        username: 'John Doe',
        photoUrl: '',
    }

    return (
        <>
            <GlobalStyle />
            <UserProvider value={user}>
                <AppWrapper>
                    <ChatPage />
                </AppWrapper>
            </UserProvider>
        </>
    );
};

export default App
