// stompClientStore.ts
import { create } from 'zustand';
import { CompatClient } from '@stomp/stompjs';

type StompClientStore = {
    stompClient: CompatClient | null;
    setStompClient: (client: CompatClient | null) => void;
};

export const useStompClientStore = create<StompClientStore>((set) => ({
    stompClient: null,
    setStompClient: (client) => set({ stompClient: client }),
}));