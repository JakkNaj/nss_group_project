import styled from "styled-components";
import { ChatStore, State } from "../../../../stores/ChatStore.ts";
import { Message } from "./Message.tsx";
import { UserStore } from "../../../../stores/UserStore.ts";

const Styled = {
	MessagesContainer: styled.div`
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		padding: 1rem;
	`,
};

export const MessagesContainer = () => {
	const { activeChat } = ChatStore.useStore((state: State) => ({
		activeChat: state.activeChat,
	}));

	const userId = UserStore.getLoggedInUser().id;

	if (!activeChat) {
		return <div>Error: No active chat found.</div>;
	}

	return (
		<Styled.MessagesContainer>
			{activeChat.messages.map((message) => (
				<Message key={message.id} message={message} userId={userId} />
			))}
		</Styled.MessagesContainer>
	);
};
