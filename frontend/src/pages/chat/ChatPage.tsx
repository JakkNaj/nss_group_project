import {ChatHeader} from "./ChatHeader.tsx";
import {ChatList} from "./list/ChatList.tsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
});

const styles = {
    chatPageContainer: {
        display: 'grid',
        gridTemplateColumns: '2fr 4fr 1fr',
        gridTemplateRows: '1fr 14fr',
        gridTemplateAreas: `
            "header header header"
            "leftSection main rightSection"
        `,
        height: '100vh',
    },

    header: {
        gridArea: 'header',
        borderBottom: '1px solid black',
    },

    leftSection: {
        gridArea: 'leftSection',
        borderRight: '1px solid black',
    },

    main: {
        gridArea: 'main',
    },

    rightSection: {
        gridArea: 'rightSection',
        borderLeft: '1px solid black',
    },
}

export const ChatPage = () => {
    return (
        <ThemeProvider theme={theme}>
            <div style={styles.chatPageContainer}>
                <header style={styles.header}>
                    <ChatHeader />
                </header>
                <section style={styles.leftSection}>
                    <ChatList />
                </section>
                <main style={styles.main}>
                    <h2>Main chat</h2>
                </main>
                <aside style={styles.rightSection}>
                    <h2>Users right section</h2>
                </aside>
            </div>
        </ThemeProvider>
    );
};