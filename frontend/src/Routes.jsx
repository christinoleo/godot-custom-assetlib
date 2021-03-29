import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {useHistory} from 'react-router';
import {makeStyles} from '@material-ui/core/styles';

import {Home, Login, SignUp, Protected, PrivateRoute} from './views';
import {Admin} from './admin';
import {logout} from './utils';
import { NSMap } from './views/NSMap';
import { Forbidden } from './views/Forbidden';
import { NSDashboard } from './views/NSDashboard';

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
                            logout();
                            history.push('/');
                            return null;
                        }}
                    />
                    <PrivateRoute path="/protected" component={Protected}/>
                    <PrivateRoute path="/map" component={NSMap}/>
                    <PrivateRoute path="/map2" component={NSDashboard}/>
                    <Route exact path="/" component={Home}/>
                </header>
            </div>
        </Switch>
    );
};
