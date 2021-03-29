import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { AuthContext, getMessage } from '../utils';

const useStyles = makeStyles((theme) => ({
    link: {
        color: '#61dafb',
    },
}));

export const Home = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const classes = useStyles();
    const authContext = useContext(AuthContext);

    const queryBackend = async () => {
        try {
            const message = await getMessage();
            setMessage(message);
        } catch (err) {
            setError(err);
        }
    };

    return (
        <>
            {!message && !error && (
                <a className={classes.link} href="#" onClick={() => queryBackend()}>
                    Click to make request to backend
                </a>
            )}
            {message && (
                <p>
                    <code>{message}</code>
                </p>
            )}
            {error && (
                <p>
                    Error: <code>{error}</code>
                </p>
            )}
            <a className={classes.link} href="/admin">
                Admin Dashboard
            </a>
            <a className={classes.link} href="/protected">
                Protected Route
            </a>
            <a className={classes.link} href="/map">
                Map
            </a>
            {!!authContext.isAuthenticated() ? (
                <a className={classes.link} href="/logout">
                    Logout
                </a>
            ) : (
                <>
                    <a className={classes.link} href="/login">
                        Login
                    </a>
                    <a className={classes.link} href="/signup">
                        Sign Up
                    </a>
                </>
            )}
        </>
    );
};
