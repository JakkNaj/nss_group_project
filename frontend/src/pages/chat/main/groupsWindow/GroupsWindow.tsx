import {useEffect, useState} from 'react';
import { StyledInputField } from '../../list/SearchField.tsx';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import Button from "@mui/material/Button";
import {colors} from "../../../../styles/colors.ts";
import {UserStore} from "../../../../stores/UserStore.ts";
import Autocomplete from "@mui/material/Autocomplete";

const Styled = {
    GroupsWindowContainer: styled("div")({
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingLeft: "60px",
        paddingTop: "2rem",
    }),
    MemberCard: styled("div")({
        display: "flex",
        minWidth: "16rem",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
    }),
    Button: styled(Button)({
        backgroundColor: `${colors.darkerBackground} !important`,
        color: `${colors.primaryText} !important`,
        fontFamily: "Zilla Slab, sans-serif !important",
        width: "16rem",
        marginTop: "1rem !important",
    }),
}

const GroupsWindow = () => {
    const [groupName, setGroupName] = useState('');
    const [username, setUsername] = useState('');
    const [members, setMembers] = useState(["marek", "jan"]);
    const [loggedInUsername, setLoggedInUsername] = useState("");

    const loggedInUser = UserStore.getLoggedInUser();

    const friends = ["manka", "rumcajs", "jelen"]; // Replace this with the actual list of friends

    useEffect(() => {
        if (loggedInUser) {
            setLoggedInUsername(loggedInUser.username);
        }
    }, []);

    //should not happen
    if (!(loggedInUsername)) {
        return <p>No user is currently logged in.</p>;
    }

    const handleAddMember = (_event: React.ChangeEvent<NonNullable<unknown>>, value: string | null) => {
        if (value && !members.includes(value)) {
            setMembers([...members, value]);
            setUsername('');
        }
    };

    const handleRemoveMember = (member :string) => {
        setMembers(members.filter(m => m !== member));
    };

    const handleCreateGroupChat = () => {
        console.log(`Created group chat ${groupName} with members ${[loggedInUser, ...members].join(', ')}`);
    };

    return (
        <Styled.GroupsWindowContainer>
            <h2>Create New Groupchat!</h2>
            <StyledInputField.TextField
                variant="outlined"
                label="Groupchat Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />
            <h2>Add Members!</h2>
            <Autocomplete
                options={friends}
                getOptionLabel={(option) => option}
                value={username}
                onInputChange={(_event, newInputValue) => {
                    setUsername(newInputValue);
                }}
                onChange={handleAddMember}
                renderInput={(params) => (
                    <StyledInputField.TextField
                        {...params}
                        variant="outlined"
                        label="Username"
                    />
                )}
                sx={{ width: '12rem' }}
            />
            <h3>members:</h3>
            <Styled.MemberCard>
                {loggedInUsername + " (You)"}
            </Styled.MemberCard>
            {members.map((member) => (
                <Styled.MemberCard key={member}>
                    {member}
                    <IconButton onClick={() => handleRemoveMember(member)}>
                        <CloseIcon/>
                    </IconButton>
                </Styled.MemberCard>
            ))}
            <Styled.Button
                variant="contained"
                onClick={handleCreateGroupChat}>
                Create Groupchat
            </Styled.Button>
        </Styled.GroupsWindowContainer>
    );
};

export default GroupsWindow;