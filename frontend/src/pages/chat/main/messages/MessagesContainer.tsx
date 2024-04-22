import styled from "styled-components";
import { Message } from "./Message.tsx";
import { UserStore } from "../../../../stores/UserStore.ts";
import {MessageType} from "../../../../model/types/MessageType.ts";

const Styled = {
	MessagesContainer: styled.div`
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		padding: 1rem;
		flex-grow: 1;
	`,
};

interface MessagesContainerProps {
	messages: MessageType[];
}

export const MessagesContainer = ({ messages }: MessagesContainerProps) => {
	const userId = UserStore.getLoggedInUser().id;

	if (!messages) {
		return <div>Error: No active chat found.</div>;
	}

	return (
		<Styled.MessagesContainer>
			{messages.map((message, index) => (
				<Message key={index} message={message} userId={userId} />
			))}
		</Styled.MessagesContainer>
	);
};
