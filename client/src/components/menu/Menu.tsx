import { Link } from "react-router-dom";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import React, { useState } from "react";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { menu } from "../../data";

const Menu = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {

  const handleSubmenuClick = (id) => {
    console.log('Clicked on menu item with id: ', id);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'home.svg':
        return <HomeIcon />;
      case 'order.svg':
        return <AddCircleIcon />;
      default:
        return <HomeIcon />; // Default icon
    }
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, flexShrink: 0 }}>
      <List>
        {menu.map((section) => (
          <React.Fragment key={section.id}>
            <ListItem button onClick={() => handleSubmenuClick(section.id)}>
              <ListItemText primary={section.title} />
            </ListItem>
            {section.listItems.map((item) => (
              <ListItem
                button
                key={item.id}
                component={Link}
                to={item.url}
                sx={{ pl: 4 }} // Apply some padding for nested items
              >
                <ListItemIcon>
                  {getIcon(item.icon)}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav">
      <Drawer 
        variant="temporary" 
        open={mobileOpen} 
        onClose={handleDrawerToggle} 
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'block' }, marginTop: '64px' }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Menu;
