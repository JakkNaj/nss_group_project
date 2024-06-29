import {UserStore} from "./stores/UserStore.ts";

export const fetchWithTokens = async (fetchSrc: RequestInfo, init?: RequestInit): Promise<Response> => {
    let accessToken = UserStore.getAccessToken();

    if (!accessToken) {
        throw new Error('no access token found, please log in again');
    }
    console.log("fetching with access token: ", accessToken);

    const response = await fetch(fetchSrc, {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: `${accessToken}`,
        },
    });

    if (response.status === 401) {
        console.warn('access token expired, trying to refresh token');
        const refreshResponse = await fetch('http://localhost:8085/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!refreshResponse.ok) {
            throw new Error('failed to refresh token');
        }

        const data = await refreshResponse.json();
        const newAccessToken = `${data.tokenType}${data.accessToken}`;
        UserStore.updateAccessToken(newAccessToken);
        accessToken = newAccessToken;

        return fetch(fetchSrc, {
            ...init,
            headers: {
                ...init?.headers,
                Authorization: `${newAccessToken}`,
            },
        });
    }

    return response;
};