import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const SearchField: React.FC = () => {
    return (
        <TextField
            variant="outlined"
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
            sx={{
                borderRadius: '10px',
                boxShadow: '3.705px 3.705px 0px 0px #000',
                '& fieldset': {
                    borderRadius: '10px',
                    border: '1px solid #000',
                    borderColor: '#000',
                },
                '&:hover fieldset': {
                    borderColor: '#000',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#000',
                },
            }}
        />
    );
};

export default SearchField;