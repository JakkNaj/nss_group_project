import create from 'zustand';
import {UserType} from "../model/types/UserType.ts";
import axios from "axios";


type FriendsStore = {
    friends: UserType[];
    addFriend: (friend: UserType) => void;
    removeFriend: (id: number) => void;
    fetchAllFriends: (username: string) => Promise<void>;
};

const useFriendsStore = create<FriendsStore>((set) => ({
    friends: [],
    fetchAllFriends: async (username) => {
        try {
            const response = await axios.get(`http://localhost:8082/friends/${username}`);
            if (response.status === 200) {
                set({ friends: response.data });
            }
        } catch (error) {
            console.error('Failed to get all friends:', error);
        }
    },
    addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
    removeFriend: (id) => set((state) => ({ friends: state.friends.filter((friend) => friend.id !== id) })),
}));

export const FriendsStore = {
    useStore: useFriendsStore,
    addFriend: useFriendsStore.getState().addFriend,
    removeFriend: useFriendsStore.getState().removeFriend,
    fetchAllFriends: useFriendsStore.getState().fetchAllFriends,
    getUserById: (id :number) => {
        return useFriendsStore.getState().friends.find((friend) => friend.id === id) || null;
    },
}