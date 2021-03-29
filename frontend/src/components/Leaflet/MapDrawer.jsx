import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import { PlotlyGraph } from './MapSubComponents';

const drawerWidth = 300;

export const useStylesMapDrawer = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
}));

export const DashDrawer = ({ open = true, onClose = () => {} }) => {
    const classes = useStylesMapDrawer();
    // const theme = useTheme();

    const handleDrawerClose = () => {
        onClose();
    };

    return (<Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        width={drawerWidth}
        openSecondary={true}
        classes={{
            paper: classes.drawerPaper,
        }}
    >
        <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon/>
            </IconButton>
        </div>
        <Divider/>
        <PlotlyGraph id={'plot1'} layout={{title:'asd'}}/>
        <Divider/>
        <PlotlyGraph id={'plot2'}/>
        <Divider/>
        <PlotlyGraph id={'plot3'}/>
        <Divider/>
    </Drawer>);
};