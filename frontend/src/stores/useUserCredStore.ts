import create from "zustand";
import {persist} from "zustand/middleware";
import {UserType} from "../model/types/UserType.ts";

export const useUserCredStore = create(persist(
    (set) => ({
        loggedInUser: null,
        setLoggedInUser: (user : UserType) => set({ loggedInUser: user }),
    }),
    {
        name: 'user-cred-storage', // unique name
    }
))