import styled from "styled-components";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Styled = {
	ChatNameWithIcon: styled.div`
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	`,
	Name: styled.p`
		font-size: 1rem;
	`,
	ArrowIcon: styled(ArrowForwardIosIcon)`
		cursor: pointer;
	`,
};

interface ChatNameWithIconProps {
	name: string;
	onIconClick: () => void;
}

export function ChatNameWithIcon({ name, onIconClick }: ChatNameWithIconProps) {
	return (
		<Styled.ChatNameWithIcon>
			<Styled.Name>{name}</Styled.Name>
			<Styled.ArrowIcon onClick={onIconClick} />
		</Styled.ChatNameWithIcon>
	);
}
