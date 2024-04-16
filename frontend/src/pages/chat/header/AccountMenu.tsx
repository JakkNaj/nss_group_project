import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styled from "styled-components";
import { colors } from "../../../styles/colors.ts";

type AccountMenuProps = {
	onAccountClick: () => void;
	onLogoutClick: () => void;
};

const Styled = {
	Menu: styled(Menu)({
		"& .MuiPaper-root": {
			backgroundColor: colors.lightBackground,
			fontFamily: "Inter, sans-serif",
			border: "0.0625rem solid black",
			marginTop: "0.5rem",
		},
	}),
};

export default function AccountMenu({ onAccountClick, onLogoutClick }: AccountMenuProps) {
	return (
		<PopupState variant="popover" popupId="demo-popup-menu">
			{(popupState) => (
				<React.Fragment>
					<IconButton {...bindTrigger(popupState)}>
						<KeyboardArrowDownIcon style={{ color: "black" }} />
					</IconButton>
					<Styled.Menu {...bindMenu(popupState)}>
						<MenuItem
							onClick={() => {
								popupState.close();
								onAccountClick();
							}}
						>
							My account
						</MenuItem>
						<MenuItem
							onClick={() => {
								popupState.close();
								onLogoutClick();
							}}
						>
							Logout
						</MenuItem>
					</Styled.Menu>
				</React.Fragment>
			)}
		</PopupState>
	);
}
