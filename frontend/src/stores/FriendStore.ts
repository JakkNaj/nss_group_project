import {create} from 'zustand';
import {UserType} from "../model/types/UserType.ts";
import axios from "axios";

/*type Friendship = {
    id: number;
    friend1: string;
    friend2: string;
}*/

type FriendsStore = {
    friends: UserType[];
    addFriend: (friend: UserType) => void;
    removeFriend: (id: number) => void;
    fetchAllFriends: (username: string) => Promise<void>;
};

const useFriendsStore = create<FriendsStore>((set) => ({
    friends: [],
    fetchAllFriends: async (username) => {
        console.log("Fetching all friends for user: ", username);
        try {
            const response = await axios.get(`http://localhost:8082/friends/${username}`);
            if (response.status === 200) {
                console.log("friends fetched data: ", response.data);
                /*const friendships: Friendship[] = response.data;*/
                /*const friendUsernames = friendships.map(friendship =>
                    friendship.friend1 === username ? friendship.friend2 : friendship.friend1
                );*/
                const friends: UserType[] = [];
                // todo map friends to UserDetails - missing endpoint to fetch based on string
                /*for (const friendUsername of friendUsernames) {
                    const friendResponse = await axios.get(`http://localhost:8081/users/${friendUsername}`);
                    if (friendResponse.status === 200) {
                        friends.push(friendResponse.data);
                    }
                }*/
                set({ friends: friends });
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