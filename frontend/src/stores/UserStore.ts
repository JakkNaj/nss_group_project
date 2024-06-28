import { create } from "zustand";
import { mapResponseToUserType, UserType } from "../model/types/UserType";
import { SignupDto } from "../model/types/SignupDto.ts";

export type UserState = {
	loggedInUser: UserType | null;
	accessToken: string | null;
};

const defaultUserState: UserState = {
	loggedInUser: null,
	accessToken: null,
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
		setAccessToken: (token: string | null) => {
			set({accessToken: token});
			if (token) {
				console.warn('setting access token in local storage', token)
				localStorage.setItem('accessToken', token);
			} else {
				localStorage.removeItem('accessToken');
			}
		}
	})
);

// When the application starts, check if the user credentials exist in the local storage
console.warn('checking local storage for user')
const savedUser = localStorage.getItem('user');
if (savedUser) {
	useUserStore.setState({ loggedInUser: JSON.parse(savedUser) });
}

//save user credentials in local storage
const saveUserToLocalStorage = (user: UserType) => {
	localStorage.setItem('user', JSON.stringify(user));
}

// When the application starts, check if the access token exists in the local storage
console.warn('checking local storage for access token')
const savedToken = localStorage.getItem('accessToken');
if (savedToken) {
	useUserStore.setState({ accessToken: savedToken });
}

//save access token in local storage
const saveTokenToLocalStorage = (token: string) => {
	localStorage.setItem('accessToken', token);
}


export const UserStore = {
	useStore: useUserStore,
	updateLoggedInUser: (user: UserType) => useUserStore.setState({ loggedInUser: user }),
	getLoggedInUser: () => useUserStore.getState().loggedInUser,
	updateAccessToken: (token: string) => useUserStore.setState({ accessToken: token }),
	getAccessToken: () => useUserStore.getState().accessToken,
	reset: () => useUserStore.setState(defaultUserState),
	login: async (username: string, password: string) => {
		try {
			const response = await fetch("http://localhost:8085/auth/login", {
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
			console.log("fetched login data", data);
			const user = mapResponseToUserType(data.user);
			const combinedAccessToken = `${data.tokenType}${data.accessToken}`;

			useUserStore.setState({ loggedInUser: user, accessToken: combinedAccessToken });
			saveUserToLocalStorage(user);
			saveTokenToLocalStorage(combinedAccessToken);

			return user;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	register: async (credentials: SignupDto) => {
		try {
			const response = await fetch("http://localhost:8085/auth/register", {
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
			console.log("fetched register data", data);
			const user = mapResponseToUserType(data.user);
			const combinedToken = `${data.tokenType}${data.accessToken}`;
			useUserStore.setState({ loggedInUser: user, accessToken: combinedToken});
			saveUserToLocalStorage(user);
			saveTokenToLocalStorage(combinedToken);
			return user;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	updateLoggedInUserAvatar: (avatar: string) => {
		console.log("updating user avatar!")
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
			const response = await fetch(`http://localhost:8085/users/${userId}`, {
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
