import React from 'react';
import Avatar from '@mui/material/Avatar';

type UserAvatarProps = {
    username: string;
    photoUrl: string | null;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ username, photoUrl }) => {
    const initials = username.split(' ').map(word => word[0]).join('').toUpperCase();

    const generateColor = (initials: string) => {
        let hash = 0;
        for (let i = 0; i < initials.length; i++) {
            hash = initials.charCodeAt(i) + ((hash << 5) - hash);
        }
        let hue = hash % 360;
        return `hsl(${hue}, 100%, 40%)`; // Lightness reduced to 40%
    };

    const avatarColor = generateColor(initials);

    return (
        photoUrl ? (
            <Avatar alt={username + " avatar"} src={photoUrl} />
        ) : (
            <Avatar style={{backgroundColor: avatarColor}}>{initials}</Avatar>
        )
    );
};

export default UserAvatar;