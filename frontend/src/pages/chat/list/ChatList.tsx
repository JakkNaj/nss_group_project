import SearchField from "./SearchField.tsx";
import ChatListItems from "./ChatListItems.tsx";

const styles = {
    chatListLayout : {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '30px',
        textAlign: 'left' as 'left',
        fontFamily: 'Inter, sans-serif',
    }
}

const chats = [
    { id: 1, avatar: '', name: 'Adam Auro', lastMessage: 'Hey, how are you?' },
    { id: 2, avatar: '', name: 'Jane Doe', lastMessage: 'See you tomorrow!' },
    { id: 3, avatar: '', name: 'Kristin Watson', lastMessage: 'Check this out...' },
    { id: 4, avatar: '', name: 'Dianne Russell', lastMessage: 'I think it\'s great. The vibrant colors...' },
    { id: 5, avatar: '', name: 'Wade Warren', lastMessage: 'Speaking of which, I saw an art exhibition the other day that was all about retro video games. It was a total blast' },
    { id: 6, avatar: '', name: 'Tobias Le', lastMessage: 'It\'s like a never-ending groove.' },
    { id: 7, avatar: '', name: 'Adam Schuppler', lastMessage: 'It\'s like a never-ending stoory aaa aaaa aaa.' },
];

const groupChats = [
    { id: 1, avatar: '', name: 'Group 1', lastMessage: 'Hey, group chat here!', members: ['Adam Auro', 'Jane Doe', 'Kristin Watson'] },
    { id: 2, avatar: '', name: 'Group 2', lastMessage: 'See you at the meeting!', members: ['Jane Doe', 'Dianne Russell', 'Wade Warren'] },
    { id: 3, avatar: '', name: 'Group 3', lastMessage: 'Check this group chat out...', members: ['Kristin Watson', 'Wade Warren', 'Tobias Le'] },
    { id: 4, avatar: '', name: 'Group 4', lastMessage: 'I think this group is great.', members: ['Dianne Russell', 'Tobias Le', 'Adam Schuppler'] },
    { id: 5, avatar: '', name: 'Group 5', lastMessage: 'Speaking of which, I saw an art exhibition the other day that was all about retro video games. It was a total blast', members: ['Wade Warren', 'Adam Schuppler', 'Adam Auro'] },
    { id: 6, avatar: '', name: 'Group 6', lastMessage: 'It\'s like a never-ending groove.', members: ['Tobias Le', 'Adam Auro', 'Jane Doe'] },
    { id: 7, avatar: '', name: 'Group 7', lastMessage: 'It\'s like a never-ending story aaa aaaa aaa.', members: ['Adam Schuppler', 'Jane Doe', 'Kristin Watson'] },
];


export const ChatList = () => {
    return (
        <div style={styles.chatListLayout}>
            <SearchField />
            <ChatListItems sectionName="Friends" chats={chats} displayRowsNumber={6}/>
            <ChatListItems sectionName="Groups" chats={groupChats} displayRowsNumber={4}/>
        </div>
    )
}