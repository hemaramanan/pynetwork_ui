import React from "react";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DnsIcon from "@material-ui/icons/Dns";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import BackupIcon from "@material-ui/icons/Backup";
import BuildIcon from "@material-ui/icons/Build";
import CodeIcon from "@material-ui/icons/Code";

import DeviceList from "./DeviceList";
import InventoryManagement from "./InventoryManagement";
import ShowCli from "./ShowCli";
import DeleteBackups from "./DeleteBackups";
import ConfigCli from "./ConfigCli";
import CreateBackups from "./CreateBackups";
import ExportBackup from "./ExportBackup";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [displayPage, setDisplayPage] = React.useState(<DeviceList />);

  const selectedPage = (index) => {
    console.log(index);
    if (index === "Inventory list") {
      setDisplayPage(<DeviceList />);
    }
    if (index === "Inventory Management") {
      setDisplayPage(<InventoryManagement />);
    }
    if (index === "Show CLI") {
      setDisplayPage(<ShowCli />);
    }
    if (index === "Config CLI") {
      setDisplayPage(<ConfigCli />);
    }
    if (index === "Config Backup") {
      setDisplayPage(<CreateBackups />);
    }
    if (index === "Config Maintainance") {
      setDisplayPage(<DeleteBackups />);
    }
    if (index === "Export Backup") {
      setDisplayPage(<ExportBackup />);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (event, index) => {
    // setOpen(!open)
    setSelectedIndex(index);
    selectedPage(index);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            PYnetwork
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {["Inventory"].map((text) => (
            <ListItem multiline key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <List>
            {["Inventory list", "Inventory Management"].map((text, index) => (
              <ListItem
                button
                key={text}
                selected={selectedIndex === text}
                onClick={(event) => handleClick(event, text)}
              >
                <ListItemIcon>
                  {index === 0 ? (
                    <DnsIcon />
                  ) : index === 1 ? (
                    <AddCircleOutlineIcon />
                  ) : index === 2 ? (
                    <EditIcon />
                  ) : (
                    <DeleteForeverIcon />
                  )}
                </ListItemIcon>
                <ListItemText secondary={text} />
              </ListItem>
            ))}
          </List>
        </List>
        <Divider />
        <List>
          {["Web CLI"].map((text) => (
            <ListItem multiline key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
          <List>
            {["Show CLI", "Config CLI"].map((text, index) => (
              <ListItem
                button
                key={text}
                selected={selectedIndex === text}
                onClick={(event) => handleClick(event, text)}
              >
                <ListItemIcon>
                  {index === 0 ? <CodeIcon /> : <BuildIcon />}
                </ListItemIcon>
                <ListItemText secondary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["Backup config"].map((text) => (
              <ListItem multiline key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            <List>
              {["Config Backup", "Config Maintainance", "Export Backup"].map(
                (text, index) => (
                  <ListItem
                    button
                    key={text}
                    selected={selectedIndex === text}
                    onClick={(event) => handleClick(event, text)}
                  >
                    <ListItemIcon>
                      {index === 0 ? (
                        <BackupIcon />
                      ) : index === 1 ? (
                        <AddCircleOutlineIcon />
                      ) : index === 2 ? (
                        <EditIcon />
                      ) : (
                        <DeleteForeverIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText secondary={text} />
                  </ListItem>
                )
              )}
            </List>
          </List>
          <Divider />
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container>
          <Grid item>{displayPage}</Grid>
        </Grid>
      </main>
    </div>
  );
}
