import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

type MenuProps = {
  onNavigate: (route: string) => void;
};

const Menu: React.FC<MenuProps> = ({ onNavigate }) => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Botón para abrir el menú */}
      <IconButton
        color="inherit"
        onClick={toggleDrawer}
        sx={{ position: "fixed", top: 10, left: 10, zIndex: 2000 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
        }}
      >
        {/* Header con usuario */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "grey.600",
            color: "white",
            p: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "white", color: "grey.600", mb: 1 }}>MB</Avatar>
          <Typography variant="subtitle1">El Mapache Bigotón</Typography>
        </Box>

        <Divider />

        {/* Menú */}
        <List>
          <ListItem component="button" onClick={() => onNavigate("Citas")}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Citas" />
          </ListItem>

          <ListItem component="button" onClick={() => onNavigate("Usarios")}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItem>

          <ListItem component="button" onClick={() => onNavigate("Servicios")}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Servicios" />
          </ListItem>

          <Divider />

          <ListItem component="button" onClick={() => onNavigate("CerrarSesion")}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Menu;
