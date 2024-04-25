import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
import Autocomplete from '@mui/material/Autocomplete';
import {ChatRoomStore} from "../../../stores/ChatRoomStore.ts";

export const StyledInputField = {
	TextField: styled(TextField)({
		borderRadius: "0.6rem",
		boxShadow: "0.2315625rem 0.2315625rem 0 0 #000",
		"& fieldset": {
			borderRadius: "0.6rem",
			border: "0.0625rem solid #000",
			borderColor: "#000",
		},
		"&:hover fieldset": {
			borderColor: "#000",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#000",
		},
	}),
};

export const SearchField = () => {
	const chats = ChatRoomStore.useStore(state => state.chats);

	const handleChatSelect = (_event : React.ChangeEvent<{}> ,value: string | null) => {
		if (value) {
			const selectedChat = chats.find(chat => chat.name == value);
			if (selectedChat) {
				ChatRoomStore.updateActiveChatRoom(selectedChat.chatLogId);
			}
		}
	}

	return (
		<Autocomplete
			options={chats.map(chat => chat.name)}
			getOptionLabel={(option) => option}
			renderInput={(params) => (
				<StyledInputField.TextField
					{...params}
					variant="outlined"
					fullWidth
					InputProps={{
						...params.InputProps,
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
			)}
			onChange={handleChatSelect}
		/>
	);
};
