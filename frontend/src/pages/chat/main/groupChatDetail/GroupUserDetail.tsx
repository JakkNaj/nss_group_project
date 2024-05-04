import styled from "styled-components";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { UserAvatar } from "../../../../components/UserAvatar.tsx";
import { colors } from "../../../../styles/colors.ts";

const Styled = {
	UserDetail: styled.section({
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		minWidth: "14rem",
		padding: "2rem",
	}),
	Avatar: styled(UserAvatar)({
		alignSelf: "center",
	}),
	UserName: styled.h4({
		alignSelf: "center",
		marginTop: "1rem",
		fontSize: "1.5rem",
		marginBottom: "1rem",
	}),
	Email: styled.p({
		marginTop: "1rem",
		fontSize: "1rem",
		borderBottom: "0.0625rem solid black",
		paddingBottom: "1rem",
		color: colors.greyText,
		width: "100%",
		textAlign: "left",
	}),
	Telephone: styled.p({
		marginTop: "0.5rem",
		fontSize: "1rem",
		borderBottom: "0.0625rem solid black",
		paddingBottom: "1rem",
		color: colors.greyText,
		width: "100%",
		textAlign: "left",
	}),
	RemoveButton: styled.button({
		marginTop: "2rem",
		padding: "0.5rem 1rem",
		backgroundColor: colors.lightBackground,
		fontSize: "1rem",
		cursor: "pointer",
		borderRadius: "0.6rem",
		border: "0.0625rem solid #000",
		boxShadow: "0.11578125rem 0.11578125rem 0 0 #000",
	}),
	ArrowIcon: styled(ArrowBackIosIcon)({
		cursor: "pointer",
		position: "absolute",
	}),
};

interface UserDetailProps {
	user: { id: number; name: string; avatar: string; email: string; phoneNumber: string };
	onBackClick: () => void;
	onRemoveClick: () => void;
}

export function GroupUserDetail({ user, onBackClick, onRemoveClick }: UserDetailProps) {
	return (
		<Styled.UserDetail>
			<Styled.ArrowIcon onClick={onBackClick} />
			<Styled.Avatar name={user.name} avatar={user.avatar} width={7} />
			<Styled.UserName>{user.name}</Styled.UserName>
			<Styled.Email>{user.email}</Styled.Email>
			<Styled.Telephone>{user.phoneNumber}</Styled.Telephone>
			<Styled.RemoveButton onClick={onRemoveClick}>Remove from group</Styled.RemoveButton>
		</Styled.UserDetail>
	);
}
