import styled from "styled-components";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { colors } from "../../../../styles/colors.ts";

const Styled = {
	UserDetail: styled.section`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 14rem;
		position: relative;
	`,
	Avatar: styled(UserAvatar)`
		align-self: center;
	`,
	UserName: styled.h4`
		align-self: center;
		margin-top: 1rem;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	`,
	Email: styled.p`
		margin-top: 1rem;
		font-size: 1rem;
		border-bottom: 0.0625rem solid black;
		padding-bottom: 1rem;
		color: ${colors.greyText};
		width: 100%;
		text-align: left;
	`,
	Telephone: styled.p`
		margin-top: 0.5rem;
		font-size: 1rem;
		border-bottom: 0.0625rem solid black;
		padding-bottom: 1rem;
		color: ${colors.greyText};
		width: 100%;
		text-align: left;
	`,
	RemoveButton: styled.button`
		margin-top: 2rem;
		padding: 0.5rem 1rem;
		background-color: ${colors.lightBackground};
		font-size: 1rem;
		cursor: pointer;
		border-radius: 0.6rem;
		border: 0.0625rem solid #000;
		box-shadow: 0.11578125rem 0.11578125rem 0 0 #000;
	`,
	ArrowIcon: styled(ArrowBackIosIcon)`
		cursor: pointer;
		position: absolute;
	`,
};

interface UserDetailProps {
	user: { id: number; name: string; avatar: string; email: string; phoneNumber: string };
	onBackClick: () => void;
	onRemoveClick: () => void;
}

export function UserDetail({ user, onBackClick, onRemoveClick }: UserDetailProps) {
	return (
		<Styled.UserDetail>
			<Styled.ArrowIcon onClick={onBackClick} />
			<Styled.Avatar username={user.name} avatar={user.avatar} width={7} />
			<Styled.UserName>{user.name}</Styled.UserName>
			<Styled.Email>{user.email}</Styled.Email>
			<Styled.Telephone>{user.phoneNumber}</Styled.Telephone>
			<Styled.RemoveButton onClick={onRemoveClick}>Remove from group</Styled.RemoveButton>
		</Styled.UserDetail>
	);
}
