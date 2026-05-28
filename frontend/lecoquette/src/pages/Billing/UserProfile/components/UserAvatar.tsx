interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: { container: 'w-8 h-8', icon: 'text-xs' },
  md: { container: 'w-10 h-10', icon: 'text-sm' },
  lg: { container: 'w-16 h-16', icon: 'text-xl' },
  xl: { container: 'w-24 h-24', icon: 'text-3xl' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function UserAvatar({ name, avatarUrl, size = 'md' }: UserAvatarProps) {
  const { container, icon } = sizeMap[size];

  return (
    <div
      className={`${container} rounded-full bg-(--color-primario) flex items-center justify-center shrink-0 overflow-hidden`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className={`${icon} font-semibold text-(--color-secundario) select-none`}>
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}