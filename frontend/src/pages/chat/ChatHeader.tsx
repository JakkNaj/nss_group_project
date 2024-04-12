import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { UserContext } from '../../context/UserContext';
import {deepOrange} from "@mui/material/colors";

const styles = {
    heading : {
        fontFamily: 'Zilla Slab, sans-serif',
        fontSize: '1.6rem',
        fontWeight: 'bold',
    },
    headerLayout: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #000',
        height: '100%',
        padding: '0 20px',
    },
    avatarLayout: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    username: {
        fontSize: '1.2rem',
        fontFamily: 'Zilla Slab, sans-serif',
        fontWeight: 'semi-bold',
    }

}

export const ChatHeader: React.FC = () => {
    const { username, photoUrl } = useContext(UserContext);
    const initials = username.split(' ').map(word => word[0]).join('').toUpperCase();

    return(
        <>
            <div style={styles.headerLayout}>
                <h2 style={styles.heading}>Messages</h2>
                <aside style={styles.avatarLayout}>
                    <span style={styles.username}>{username}</span>
                    {photoUrl ? (
                        <Avatar alt={username + " avatar"} src={photoUrl} />
                    ) : (
                        <Avatar sx={{bgcolor: deepOrange[500]}}>{initials}</Avatar>
                    )}
                    <KeyboardArrowDownIcon />
                </aside>
            </div>
        </>
    )
}