import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { StyledInputField } from '../pages/chat/list/SearchField.tsx'
import LockIcon from '@mui/icons-material/Lock';

interface PasswordInputProps {
    setPassword: (password: string) => void;
    passwordError: string;
}

export const PasswordInput = (props: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <StyledInputField.TextField
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            onChange={e => props.setPassword(e.target.value)}
            error={!!props.passwordError}
            helperText={props.passwordError}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <LockIcon />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};