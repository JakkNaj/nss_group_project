import {SetStateAction, useEffect, useState} from 'react';
import {StyledInputField} from '../../list/SearchField.tsx';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import Button from "@mui/material/Button";
import {colors} from "../../../../styles/colors.ts";
import {FriendRequestStore} from "../../../../stores/FriendRequestStore.ts";
import {UserStore} from "../../../../stores/UserStore.ts";
import {FriendsStore} from "../../../../stores/FriendStore.ts";
import {CircularProgress} from "@mui/material";

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
    const [loading, setLoading] = useState(false);
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [username, setUsername] = useState('');
    const [explainText, setExplainText] = useState("");


    const loggedInUser = UserStore.getLoggedInUser();

    useEffect(() => {
        if (loggedInUser) {
            setLoggedInUsername(loggedInUser.username);
            //fetch all friend requests and friends
            Promise.all([
                FriendRequestStore.fetchAllFriendRequests(loggedInUser.username),
                FriendsStore.fetchAllFriends(loggedInUser.username)
            ]).then(() => setLoading(false));
        }
    }, []);

    const friendRequests = FriendRequestStore.useStore((state) => state.friendRequests);
    const friends = FriendsStore.useStore((state) => state.friends);

    //should not happen
    if (!loggedInUser){
        return <div>No user logged in.</div>
    }

    if (loading) {
        return <CircularProgress />;
    }

    const handleAccept = (username: string) => {
        FriendRequestStore.acceptFriendRequest(username, loggedInUsername);
    };

    const handleDecline = (username: string) => {
        FriendRequestStore.declineFriendRequest(username, loggedInUsername);
    };

    const handleSendRequest = () => {
        if (username && loggedInUsername) {
            console.log("Sending FR to user: ", username);
            FriendRequestStore.sendFriendRequest(username, loggedInUsername);
            setExplainText(`If user with username ${username} exists, they will recieve your Friend request`)
        }
    }

    const onChangeInputField = (e: { target: { value: SetStateAction<string>; }; }) => {
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
            {friendRequests.length === 0 && <div>No unanswered friend requests</div>}
            <h3 style={{marginTop: "4rem"}}>Friends</h3>
            {friends.map((friend) => (
                <div key={friend.id}>
                    {friend.username}
                </div>
            ))}
            {friends.length === 0 && <div>No friends yet</div>}
        </Styled.FriendsWindowContainer>
    );
};

export default FriendsWindow;