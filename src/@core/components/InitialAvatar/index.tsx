import React from 'react'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

interface InitialAvatarProps {
  name: string
  image?: string | null
  onClick?: (event: React.SyntheticEvent) => void
}

const getInitials = (name: string) => {
  const names = name.split(' ')
  return names.map(word => word.charAt(0))[0].toUpperCase()
}

const InitialAvatar: React.FC<InitialAvatarProps> = ({ name, image, onClick }) => {
  const handleClick = (event: React.SyntheticEvent) => {
    if (onClick) {
      onClick(event)
    }
  }

  if (image) {
    return <Avatar alt={name} src={image} sx={{ width: '2.5rem', height: '2.5rem' }} onClick={handleClick} />
  } else {
    const pastelColor = '#FFB6C1'
    const initials = getInitials(name)
    return (
      <Avatar
        alt={name}
        sx={{
          width: '2.5rem',
          height: '2.5rem',
          backgroundColor: pastelColor,
          color: '#000',
          cursor: onClick ? 'pointer' : 'default' // Menambahkan cursor pointer jika ada onClick
        }}
        onClick={handleClick}
      >
        <Typography variant='h5' sx={{ fontSize: '0.8rem', color: 'text.disabled' }} color='white'>
          {initials}
        </Typography>
      </Avatar>
    )
  }
}

export default InitialAvatar
