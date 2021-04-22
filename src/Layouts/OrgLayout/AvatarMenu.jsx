import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, Button, Avatar, Divider } from "@material-ui/core";
import { signOut, useSession } from "next-auth/client";

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(2),
  },
}));

export default function AvatarMenu() {
  const [session] = useSession();
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {session?.user && (
        <>
          <Button
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              alt={session.user.name}
              src={session.user.image || session.user.picture}
              className={classes.avatar}
            />
            {session.user.name}
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <Divider />
            <MenuItem onClick={signOut}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}
