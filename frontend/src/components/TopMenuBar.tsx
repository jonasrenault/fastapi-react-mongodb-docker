import * as React from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  Link,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  ListItemIcon,
  Tooltip,
  Button,
} from '@mui/material';
import { PersonAdd, Settings, Logout } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

export default function TopMenuBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/');
  };

  return (
    <AppBar position='absolute'>
      <Toolbar>
        <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
          <Link component={NavLink} to='/' color='inherit' underline='none'>
            FARMD
          </Link>
        </Typography>

        {user !== undefined && user.is_superuser && (
          <Button component={NavLink} to='/users' sx={{ color: '#fff' }}>
            Users
          </Button>
        )}

        {user !== undefined && (
          <Tooltip title='Account settings'>
            <IconButton
              onClick={handleClick}
              size='small'
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user && user.first_name ? user.first_name[0] : 'P'}
              </Avatar>
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link component={NavLink} to='/profile' color='inherit' underline='none'>
          <MenuItem onClick={handleClose}>
            <Avatar /> Profile
          </MenuItem>
        </Link>

        <Divider />
        <MenuItem onClick={handleClose} disabled={true}>
          <ListItemIcon>
            <PersonAdd fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose} disabled={true}>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
