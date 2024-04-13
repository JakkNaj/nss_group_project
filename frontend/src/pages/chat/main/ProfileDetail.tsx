import styled from "styled-components";
import { UserAvatar } from "../../../components/UserAvatar.tsx";
import { UserStore } from "../../../context/UserStore.ts";

const Styled = {
	ProfileDetail: styled.section`
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	`,
	Avatar: styled(UserAvatar)`
		width: 5rem;
		height: 5rem;
	`,
	Email: styled.p`
		margin-top: 1rem;
		font-size: 1rem;
	`,
	Telephone: styled.p`
		margin-top: 0.5rem;
		font-size: 1rem;
	`,
};

export const ProfileDetail = () => {
	const { username, avatar, email, phoneNumber } = UserStore.useStore((state) => ({
		username: state.loggedInUser.name,
		avatar: state.loggedInUser.avatar,
		email: state.loggedInUser.avatar,
		phoneNumber: state.loggedInUser.phoneNumber,
	}));

	return (
		<Styled.ProfileDetail>
			<Styled.Avatar username={username} photoUrl={avatar} />
			<Styled.Email>{email}</Styled.Email>
			<Styled.Telephone>{phoneNumber}</Styled.Telephone>
		</Styled.ProfileDetail>
	);
};
