import {colors} from "./styles/colors.ts";
import {ChatPage} from "./Pages/ChatPage.tsx";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
      margin: 0;
      background-color: ${colors.lightBackground};
      text-align: center;
  }
`;

const App: React.FC = () => {
    return (
        <>
            <GlobalStyle />
            <div>
                <ChatPage />
            </div>
        </>
    );
};

export default App
