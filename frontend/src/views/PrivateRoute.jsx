import React from 'react';

import { isAuthenticated, logout } from '../utils';
import { Route } from 'react-router-dom';
import { Redirect, useHistory } from 'react-router';

export const PrivateRoute = ({ children, ...rest }) => {
    const history = useHistory();
    const auth = isAuthenticated();
    console.log(auth);
    if (!auth) {
        logout();
        history.push('/login');
        return <div/>;
    } else {
        return <Route render={(props) => React.createElement(children, {auth, ...props})} {...rest}/>;
    }
};
