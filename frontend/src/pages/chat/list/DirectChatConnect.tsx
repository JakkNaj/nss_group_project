import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { ChatRoomStore } from '../../../stores/ChatRoomStore.ts';
import {useChat} from "../../../hooks/useChat.tsx";
import {UserStore} from "../../../stores/UserStore.ts";

interface DirectChatConnectProps {
    toggleProfileWindow: () => void;
}

export const DirectChatConnect = ({toggleProfileWindow} : DirectChatConnectProps) => {
    const [chatId, setChatId] = useState('');
    const { sendMessage } = useChat({ userId: UserStore.getLoggedInUser().id });

    const handleConnect = async () => {
        const id = parseInt(chatId);
        if (!isNaN(id)) {
            try {
                const chatRoom = await ChatRoomStore.getChatRoom(id);
                if (chatRoom) {
                    await ChatRoomStore.setActiveChatRoom(chatRoom);
                    toggleProfileWindow();
                    sendMessage({ content: 'User has joined the chat', chatId: chatRoom.chatLogId, type: 'JOIN' });
                } else {
                    console.error('Chat room not found');
                }
            } catch (error) {
                console.error(error);
            }
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