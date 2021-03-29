import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';

import { Home, Login, PrivateRoute, Protected, SignUp, SuperuserPrivateRoute } from './views';
import { Admin } from './admin';
import { AuthContext, logout } from './utils';
import { Forbidden } from './views/Forbidden';

const useStyles = makeStyles((theme) => ({
    app: {
        textAlign: 'center',
    },
    header: {
        backgroundColor: '#282c34',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white',
    },
}));

export const Routes = () => {
    const classes = useStyles();
    const history = useHistory();
    const authContext = useContext(AuthContext);

    return (
        <Switch>
            <Route path="/admin">
                <Admin/>
            </Route>

            <div className={classes.app}>
                <header className={classes.header}>
                    <Route path="/login" component={Login}/>
                    <Route path="/forbidden" component={Forbidden}/>
                    <Route path="/signup" component={SignUp}/>
                    <Route
                        path="/logout"
                        render={() => {
                            logout(authContext);
                            history.push('/');
                            return null;
                        }}
                    />
                    <PrivateRoute path="/protected" component={Protected}/>
                    <Route exact path="/" component={Home}/>
                </header>
            </div>
        </Switch>
    );
};
