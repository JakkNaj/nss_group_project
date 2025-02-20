import Avatar from "@mui/material/Avatar";

type UserAvatarProps = {
	name: string;
	avatar: string | undefined;
	className?: string;
	width?: number;
};

export const UserAvatar = (props: UserAvatarProps) => {
	const words = props.name.split(" ");
	const initials = (words[0][0] + (words[1] ? words[1][0] : "")).toUpperCase();

	const generateColor = (initials: string) => {
		let hash = 0;
		for (let i = 0; i < initials.length; i++) {
			hash = initials.charCodeAt(i) + ((hash << 5) - hash);
		}
		let hue = hash % 360;
		return `hsl(${hue}, 100%, 40%)`;
	};

	const avatarColor = generateColor(initials);

	const avatarSrc = `data:image/jpeg;base64,${props.avatar}`;

	return props.avatar ? (
		<Avatar
			className={props.className}
			alt={props.name + " avatar"}
			src={avatarSrc}
			style={{ width: `${props?.width}rem`, height: `${props?.width}rem` }}
		/>
	) : (
		<Avatar
			className={props.className}
			style={{
				backgroundColor: avatarColor,
				width: `${props?.width}rem`,
				height: `${props?.width}rem`,
				fontSize: props?.width ? `${props?.width * 0.5}rem` : "1rem",
			}}
		>
			{initials}
		</Avatar>
	);
};
