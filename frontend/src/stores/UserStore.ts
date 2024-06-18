import { create } from "zustand";
import { mapResponseToUserType, UserType } from "../model/types/UserType";
import { SignupDto } from "../model/types/SignupDto.ts";

export type UserState = {
	loggedInUser: UserType | null;
};

const defaultUserState: UserState = {
	loggedInUser: null,
};

const useUserStore = create<UserState>(
	(set) => ({
		...defaultUserState,
		setLoggedInUser: (user: UserType | null) => {
			set({ loggedInUser: user });
			if (user) {
				console.warn('setting user in local storage', user)
				localStorage.setItem('user', JSON.stringify(user));
			} else {
				localStorage.removeItem('user');
			}
		},
	})
);

// When the application starts, check if the user credentials exist in the local storage
console.warn('checking local storage for user')
const savedUser = localStorage.getItem('user');
console.log('saved user:', savedUser)
if (savedUser) {
	useUserStore.setState({ loggedInUser: JSON.parse(savedUser) });
}

//save user credentials in local storage --> todo later change for token
const saveUserToLocalStorage = (user: UserType) => {
	localStorage.setItem('user', JSON.stringify(user));
}

export const UserStore = {
	useStore: useUserStore,
	updateLoggedInUser: (user: UserType) => useUserStore.setState({ loggedInUser: user }),
	getLoggedInUser: () => useUserStore.getState().loggedInUser,
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
			saveUserToLocalStorage(user);

			//todo fetch users data (friends)
			return user;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	register: async (credentials: SignupDto) => {
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

			const user = mapResponseToUserType(data);
			useUserStore.setState({ loggedInUser: user });
			saveUserToLocalStorage(user);

			return user;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	updateLoggedInUserAvatar: (avatar: string) => {
		console.log("updating users avatar with: ", avatar);
		const loggedInUser = useUserStore.getState().loggedInUser;
		if (!loggedInUser) {
			throw new Error("No user is logged in.");
		}
		loggedInUser.avatar = avatar;
		useUserStore.setState({ loggedInUser: loggedInUser });
		saveUserToLocalStorage(loggedInUser);
	},
	fetchUserDetails: async (userId: number) => {
		try {
			const response = await fetch(`http://localhost:8081/users/${userId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
			}

			const data = await response.json();
			return mapResponseToUserType(data);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};
