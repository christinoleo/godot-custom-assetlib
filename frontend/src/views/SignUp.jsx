import React, {useState} from 'react';
import {Button, Grid, Paper, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Face, Fingerprint} from '@material-ui/icons';
import {Alert} from '@material-ui/lab';
import {Redirect} from 'react-router-dom';
import {useHistory} from 'react-router';

import {isAuthenticated, signUp} from '../utils/auth';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1),
    },
    button: {
        textTransform: 'none',
    },
    marginTop: {
        marginTop: 10,
    },
}));

export const SignUp = () => {
    const classes = useStyles();
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (_) => {
        // Password confirmation validation
        if (password !== passwordConfirmation) setError('Passwords do not match');
        else {
            setError('');
            try {
                const data = await signUp(email, password, passwordConfirmation);

                if (data) {
                    history.push('/');
                }
            } catch (err) {
                if (err instanceof Error) {
                    // handle errors thrown from frontend
                    setError(err.message);
                } else {
                    // handle errors thrown from backend
                    setError(err);
                }
            }
        }
    };

    return !!isAuthenticated() ? (
        <Redirect to="/"/>
    ) : (
        <Paper className={classes.padding}>
            <div className={classes.margin}>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Face/>
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.currentTarget.value)
                            }
                            fullWidth
                            autoFocus
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Fingerprint/>
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.currentTarget.value)
                            }
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Fingerprint/>
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField
                            id="passwordConfirmation"
                            label="Confirm password"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.currentTarget.value)
                            }
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <br/>
                <Grid container alignItems="center">
                    {error && (
                        <Grid item>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}
                </Grid>
                <Grid container justify="center" className={classes.marginTop}>
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.button}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                </Grid>
            </div>
        </Paper>
    );
};