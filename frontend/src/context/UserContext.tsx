import React from 'react';

interface UserContextType {
    username: string;
    photoUrl: string;
}

export const UserContext = React.createContext<UserContextType>({
    username: 'John Doe',
    photoUrl: '',
});

export const UserProvider = UserContext.Provider;