import { create } from "zustand";
import { CompatClient } from "@stomp/stompjs";

type StompClientStore = {
	stompClient: CompatClient | null;
	setStompClient: (client: CompatClient | null) => void;
	disconnectStompClient: () => void;
};

export const useStompClientStore = create<StompClientStore>((set, get) => ({
	stompClient: null,
	setStompClient: (client) => set({ stompClient: client }),
	disconnectStompClient: () => {
		get().stompClient?.disconnect(() => {
			console.log("Disconnected from websocket");
		});
	},
}));
