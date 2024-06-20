export type UserType = {
	id: number;
	name: string;
	username: string;
	email: string;
	phoneNumber: string;
	avatar: string;
};

export function mapResponseToUserType(response: any): UserType {
	return {
		id: response.userId || 0,
		name: response.name || "",
		email: response.email || "",
		username: response.username || "",
		phoneNumber: response.phoneNumber || "",
		avatar: response.thumbnail || "",
	};
}
