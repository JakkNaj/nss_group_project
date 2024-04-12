import React, { useContext } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { UserContext } from '../../context/UserContext';
import UserAvatar from "../../components/UserAvatar.tsx";

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
        padding: '0 30px',
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

    return(
        <>
            <div style={styles.headerLayout}>
                <h2 style={styles.heading}>Messages</h2>
                <aside style={styles.avatarLayout}>
                    <span style={styles.username}>{username}</span>
                    <UserAvatar username={username} photoUrl={photoUrl}/>
                    <KeyboardArrowDownIcon />
                </aside>
            </div>
        </>
    )
}