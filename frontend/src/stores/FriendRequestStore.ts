import {create} from 'zustand';
import axios from 'axios';

type FriendRequest = {
    id: number;
    senderUsername: string;
    recipientUsername: string;
}

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
        console.log("Sending friend request from: ", sender, " to: ", recipient)
        try {
            const response = await axios.post(`http://localhost:8082/friendRequest/${sender}/${recipient}`);
            if (response.status === 200) {
                console.log("friend request sent successfully");
            }
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    },
    acceptFriendRequest: async (sender, recipient) => {
        console.log("Accepting friend request from: ", sender, " to: ", recipient)
        try {
            const response = await axios.post(`http://localhost:8082/friendRequest/accept/${sender}/${recipient}`);
            if (response.status === 200) {
                // todo propagate the friend to the friends store - user identified with username inside the friend request
                // const senderDetails = await UserStore.fetchUserDetails(sender);
                // FriendsStore.addFriend(senderDetails);
                set((state) => ({ friendRequests: state.friendRequests.filter((request) => request !== recipient) }));
            }
        } catch (error) {
            console.error('Failed to accept friend request:', error);
        }
    },
    declineFriendRequest: async (sender, recipient) => {
        console.log("Declining friend request from: ", sender, " to: ", recipient)
        try {
            const response = await axios.post(`http://localhost:8082/friendRequest/decline/${sender}/${recipient}`);
            if (response.status === 200) {
                set((state) => ({ friendRequests: state.friendRequests.filter((request) => request !== sender) }));
            }
        } catch (error) {
            console.error('Failed to decline friend request:', error);
        }
    },
    fetchAllFriendRequests: async (username) => {
        console.log("Fetching all friend requests for user: ", username)
        try {
            const response = await axios.get(`http://localhost:8082/friendRequest/${username}`);
            if (response.status === 200) {
                console.log("response.data: ", response.data);
                const senderUsernames = response.data.map((request : FriendRequest) => request.senderUsername);
                console.log("senderUsername: ", senderUsernames);
                set({ friendRequests: senderUsernames });
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