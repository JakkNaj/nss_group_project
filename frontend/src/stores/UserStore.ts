import { create } from "zustand";
import {mapResponseToUserType, UserType} from "../model/types/UserType";
import { usersData } from "../MockData.ts";
import { SignupDto } from "../model/types/SignupDto.ts";

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
	login: async (username: string, password: string) => {
		try {
			const response = await fetch("http://localhost:8081/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					username: username,
					password: password,
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
			}

			const data = await response.json();
			const user = mapResponseToUserType(data);
			useUserStore.setState({ loggedInUser: user });
			//todo fetch users data (friends)
			return user;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	register: async (credentials :SignupDto) => {
		try {
			const response = await fetch("http://localhost:8081/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
			}

			const data = await response.json();
			console.log(data);

			const user = mapResponseToUserType(data);
			useUserStore.setState({ loggedInUser: user });

			return user;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};
