import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { ChatStore } from '../../../stores/ChatStore';
import { useChat } from '../../../hooks/useChat';

const DirectChatConnect = () => {
    const [chatId, setChatId] = useState('');

    const handleConnect = () => {
        const id = parseInt(chatId);
        if (!isNaN(id)) {
            ChatStore.updateActiveChat(id);
            useChat({ username: 'username', chatId: id });
        }
    };

    return (
        <div>
            <h3>Connect to Direct Chat</h3>
            <TextField
                variant="outlined"
                label="Chat ID"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
            />
            <Button variant="contained" onClick={handleConnect}>
                Connect
            </Button>
        </div>
    );
};

export default DirectChatConnect;