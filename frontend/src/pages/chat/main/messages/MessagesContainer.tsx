import { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { Message } from "./Message.tsx";
import { UserStore } from "../../../../stores/UserStore.ts";
import { useChatLogStore } from "../../../../stores/ChatLogStore.ts";

const Styled = {
	MessagesContainer: styled.div`
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		padding: 1rem;
		flex-grow: 1;
	`,
};

type MessagesContainerProps = {
	handleReplyClick: (messageId : string, messageContent : string | null) => void;
};

export const MessagesContainer = (props : MessagesContainerProps) => {
	const userId = UserStore.getLoggedInUser().id;
	const { activeChatLog } = useChatLogStore((state) => ({
		activeChatLog: state.activeChatLog,
	}));

	const [messages, setMessages] = useState(activeChatLog?.messages || []);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (activeChatLog?.messages) {
			const sortedMessages = [...activeChatLog.messages].sort((a, b) => a.timestampInSeconds - b.timestampInSeconds);
			setMessages(sortedMessages);
		} else {
			setMessages([]);
		}
	}, [activeChatLog]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!activeChatLog) {
		return <div>Error: No active chat found.</div>;
	} else if (activeChatLog.messages.length === 0) {
		return <div>Start the conversation!</div>;
	}



	return (
		<Styled.MessagesContainer>
			{messages.map((message) => (
				<Message key={message.id} message={message} userId={userId} handleReplyClick={props.handleReplyClick}/>
			))}
			<div ref={messagesEndRef} />
		</Styled.MessagesContainer>
	);
};