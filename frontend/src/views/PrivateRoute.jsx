import React, { useContext } from 'react';

import { AuthContext, logout } from '../utils';
import { Route } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router';

export const PrivateRoute = ({ children, ...rest }) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const location = useLocation();
    if(location.pathname !== rest.path){
        return <div/>;
    } else if (!authContext.isAuthenticated()) {
        logout(authContext);
        history.push('/login');
        return <div/>;
    } else {
        return <Route render={(props) => React.createElement(children, { auth, ...props })} {...rest}/>;
    }
};

export const SuperuserPrivateRoute = ({ children, component, ...rest }) => {
    const history = useHistory();
    const location = useLocation();
    const authContext = useContext(AuthContext);
    if(location.pathname !== rest.path){
        return <div/>;
    } else if (!authContext.isAuthenticated()) {
        logout(authContext);
        history.push('/login');
        return <div/>;
    } else if (!authContext.isAdmin()) {
        history.push('/forbidden');
        return <div/>;
    } else {
        return <Route render={(props) => React.createElement(component, { ...props })} {...rest}/>;
    }
};
