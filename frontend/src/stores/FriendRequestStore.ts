import {create} from 'zustand';
import axios from 'axios';

type FriendRequestState = {
    friendRequests: string[];
    sendFriendRequest: (recipient: string, sender: string) => Promise<void>;
    acceptFriendRequest: (sender: string, recipient: string) => Promise<void>;
    declineFriendRequest: (sender: string, recipient: string) => Promise<void>;
    fetchAllFriendRequests: (username: string) => Promise<void>;
};

const useFriendRequestStore = create<FriendRequestState>((set) => ({
    friendRequests: [],
    sendFriendRequest: async (recipient, sender) => {
        try {
            const response = await axios.post(`http://localhost:8082/friendRequest/${recipient}`, { sender });
            if (response.status === 200) {
                set((state) => ({ friendRequests: [...state.friendRequests, recipient] }));
            }
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    },
    acceptFriendRequest: async (sender, recipient) => {
        //maybe todo propagate user to friends
        try {
            const response = await axios.post(`http://localhost:8082/friendRequest/accept/${sender}`, { recipient });
            if (response.status === 200) {
                set((state) => ({ friendRequests: state.friendRequests.filter((request) => request !== sender) }));
            }
        } catch (error) {
            console.error('Failed to accept friend request:', error);
        }
    },
    declineFriendRequest: async (sender, recipient) => {
        try {
            const response = await axios.post(`http://localhost:8082/friendRequest/decline/${sender}`, { recipient });
            if (response.status === 200) {
                set((state) => ({ friendRequests: state.friendRequests.filter((request) => request !== sender) }));
            }
        } catch (error) {
            console.error('Failed to decline friend request:', error);
        }
    },
    fetchAllFriendRequests: async (username) => {
        try {
            const response = await axios.get(`http://localhost:8082/friendRequest/${username}`);
            if (response.status === 200) {
                set({ friendRequests: response.data });
            }
        } catch (error) {
            console.error('Failed to get all friend requests:', error);
        }
    },
}));

export const FriendRequestStore = {
    useStore: useFriendRequestStore,
    sendFriendRequest: useFriendRequestStore.getState().sendFriendRequest,
    acceptFriendRequest: useFriendRequestStore.getState().acceptFriendRequest,
    declineFriendRequest: useFriendRequestStore.getState().declineFriendRequest,
    fetchAllFriendRequests: useFriendRequestStore.getState().fetchAllFriendRequests,
};