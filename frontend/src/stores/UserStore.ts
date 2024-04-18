import { create } from "zustand";
import { UserType } from "../model/types/UserType";
import { usersData } from "../MockData.ts";

export type UserState = {
	users: typeof usersData;
	loggedInUser: UserType;
};

const getUserById = (userId: number) => usersData.find((user) => user.id === userId);

const defaultUserState: UserState = {
	users: usersData,
	loggedInUser: {
		id: 1,
		avatar: "",
		name: "Adam Auro",
		email: "adam.auro@example.com",
		username: "adamíí",
		phoneNumber: "123-456-7890",
	},
};

const useUserStore = create<UserState>(() => defaultUserState);

export const UserStore = {
	useStore: useUserStore,
	updateLoggedInUser: (user: UserType) => useUserStore.setState({ loggedInUser: user }),
	getLoggedInUser: () => useUserStore.getState().loggedInUser,
	getUserById: getUserById,
	reset: () => useUserStore.setState(defaultUserState),
};
