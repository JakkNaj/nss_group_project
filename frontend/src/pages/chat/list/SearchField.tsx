import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";

const Styled = {
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
	return (
		<Styled.TextField
			variant="outlined"
			fullWidth
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon />
					</InputAdornment>
				),
			}}
		/>
	);
};
