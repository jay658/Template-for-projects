import * as React from 'react';

import AdbIcon from '@mui/icons-material/Adb';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DefaultUserIcon from '../assets/default-user-icon.png'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material'
// import { useLogoutMutation } from '../Store/RTK/authSlice';
import { useNavigate } from 'react-router-dom'

const breakpoints = {
  mobile: 768
};

const mq = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`
};

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const tabs = {
  Home: '',
  About: 'about',
  Draw: 'draw',
  'Join Screen': 'join',
  Rooms: 'rooms'
}

const mobile = new Set(['Draw', 'Join Screen', 'Rooms'])

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: 'white'
}))

const NavBarBox = styled(Box)(() => ({
  display: 'flex',
}))

const NavButton = styled(Button)(() => ({
  [mq.mobile]: {
    display: 'none', // Hide all tabs by default on mobile
  }
}))

const AppIcon = styled(AdbIcon)(() => ({
  color: 'black',
  display: 'flex',
  marginRight: 8, 
  '@media (max-width: 600px)': {
    display: 'flex',
  },
  '@media (min-width: 960px)': {
    display: 'flex',
  },
}));

const HomeLink = styled(Typography)(() => ({
  marginRight: 16, 
  display: 'flex',
  flexGrow: 1,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',
  '@media (max-width: 600px)': { 
    display: 'flex',
  },
  '@media (min-width: 960px)': { 
    display: 'flex',
  },
}));

const CenteredTypography = styled(Typography)(() => ({
  textAlign: 'center'
}))

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate()

  // const [logoutMutation] = useLogoutMutation()

  // const handleLogout = async () => {
  //   await logoutMutation();
  // };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <HomeLink variant="h5" noWrap>
            <Button onClick={() => navigate('/')}><AppIcon/></Button>
          </HomeLink>
          <NavBarBox>
            {Object.entries(tabs).map(entry => {
              const [linkName, linkRoute] = entry
              return(
                  <NavButton onClick={() => navigate(`/${linkRoute}`)} key={linkName} style={!mobile.has(linkName)?{}: {display:'flex'}}>
                    {linkName}
                  </NavButton>
              )
            })}
            {/* <Button onClick={handleLogout}>
              Logout
            </Button> */}
          </NavBarBox>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={DefaultUserIcon} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <CenteredTypography>{setting}</CenteredTypography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
export default ResponsiveAppBar;