import {create} from 'zustand';
import axios from 'axios';

type State = {
    blockedUsers: Map<string, boolean>;
    blockUser: (username: string) => void;
    unblockUser: (username: string) => void;
};

const useBlockStore= create<State>((set) => ({
    blockedUsers: new Map(),
    blockUser: (username) => set((state) => {
        state.blockedUsers.set(username, true);
        return {...state};
    }),
    unblockUser: (username) => set((state) => {
        state.blockedUsers.set(username, false);
        return { ...state };
    }),
}));

export const BlockStore = {
    useStore: useBlockStore,
    blockUser: async (username: string) => {
        try {
            const response = await axios.post('http://localhost:8082/block', { username });
            if (response.status === 204) {
                useBlockStore.getState().blockUser(username);
            }
        } catch (error) {
            console.error('Failed to block user:', error);
        }
    },
    unblockUser: async (username: string) => {
        try {
            const response = await axios.delete(`http://localhost:8082/block/${username}`);
            if (response.status === 204) {
                useBlockStore.getState().unblockUser(username);
            }
        } catch (error) {
            console.error('Failed to unblock user:', error);
        }
    },
    isBlocked: (username: string) => {
        return useBlockStore.getState().blockedUsers.get(username);
    }
}