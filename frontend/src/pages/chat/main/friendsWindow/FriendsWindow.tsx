import { useState } from 'react';
import { StyledInputField } from '../../list/SearchField.tsx';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import Button from "@mui/material/Button";
import {colors} from "../../../../styles/colors.ts";

const Styled = {
    FriendsWindowContainer: styled("div")({
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingLeft: "60px",
        paddingTop: "2rem",
    }),
    RequestCard: styled("div")({
        display: "flex",
        minWidth: "16rem",
        justifyContent: "space-between",
        alignItems: "center",
    }),
    RequestCardIcons: styled("div")({
       display: "flex",
       gap: "0.5rem",
    }),
    Button: styled(Button)({
        backgroundColor: `${colors.darkerBackground} !important`,
        color: `${colors.primaryText} !important`,
        fontFamily: "Zilla Slab, sans-serif !important",
        width: "16rem",
        marginTop: "1rem !important",
    }),
}

const FriendsWindow = () => {
    const [username, setUsername] = useState('');
    const [explainText, setExplainText] = useState("");

    // Replace this with the actual friend requests data
    const friendRequests = ['user1', 'user2', 'user3'];

    const handleAccept = (username: string) => {
        console.log(`Accepted friend request from ${username}`);
    };

    const handleDecline = (username: string) => {
        console.log(`Declined friend request from ${username}`);
    };

    const handleSendRequest = () => {
        if (username){
            console.log("Adding user with username ", username);
            setExplainText(`If user with username ${username} exists, they will recieve your Friend request`)
        }
    }

    const onChangeInputField = (e) => {
        setUsername(e.target.value);
        setExplainText("");
    }

    return (
        <Styled.FriendsWindowContainer>
            <h2>Add Friends!</h2>
            <StyledInputField.TextField
                variant="outlined"
                label="Username"
                value={username}
                onChange={onChangeInputField}
            />
            <Styled.Button
                variant="contained"
                onClick={handleSendRequest}>
                Send Friend Request
            </Styled.Button>
            <div style={{height: "1.5rem", paddingTop: "1rem"}}>{explainText}</div>
            <h3 style={{marginTop: "4rem"}}>Friend Requests</h3>
            {friendRequests.map((request) => (
                <Styled.RequestCard key={request}>
                    {request}
                    <Styled.RequestCardIcons>
                        <IconButton onClick={() => handleAccept(request)}>
                            <CheckIcon/>
                        </IconButton>
                        <IconButton onClick={() => handleDecline(request)}>
                            <CloseIcon/>
                        </IconButton>
                    </Styled.RequestCardIcons>
                </Styled.RequestCard>
            ))}
        </Styled.FriendsWindowContainer>
    );
};

export default FriendsWindow;