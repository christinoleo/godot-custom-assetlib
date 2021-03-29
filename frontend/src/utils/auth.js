import decodeJwt from 'jwt-decode';
import { BASE_URL } from '../config';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const AUTH_ADMIN = 'admin';
export const AUTH_USER = 'user';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [permissions, setPermissions] = useState(localStorage.getItem('permissions'));
    const [token, setToken] = useState(localStorage.getItem('token'));

    const checkUserData = () => {
        console.log('AUTH CHANGE', permissions,
            localStorage.getItem('permissions'),
            localStorage.getItem('token')
        );
        if(localStorage.getItem('permissions') !== permissions)
            setPermissions(localStorage.getItem('permissions'));
        if(localStorage.getItem('token') !== token)
            setToken(localStorage.getItem('token'));
    };

    useEffect(() => {
        window.addEventListener('storage', checkUserData);
        return () => window.removeEventListener('storage', checkUserData);
    }, []);

    // if (!permissions || (permissions !== AUTH_ADMIN && permissions !== AUTH_USER)) {
    //     return false;
    // }

    // return { token: localStorage.getItem('token'), permissions: permissions };
    const isAuthenticated = () => {
        return (!!permissions && (permissions === AUTH_ADMIN || permissions === AUTH_USER));
    };
    const isAdmin = () => {
        return (!!permissions && permissions === AUTH_ADMIN);
    };
    const setLogin = (data) => {
        setPermissions(data.permissions);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('permissions', data.permissions);
    };
    const clearLogin = () => {
        setPermissions(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('permissions');
    };

    return (
        <AuthContext.Provider value={{
            token, permissions, isAuthenticated, isAdmin, setLogin, clearLogin,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Login to backend and store JSON web token on success
 *
 * @param email: string
 * @param password: string
 * @returns JSON data containing access token on success
 * @throws Error on http errors or failed attempts
 */
export const login = async (email, password, authContext) => {
    // Assert email or password is not empty
    if (!(email.length > 0) || !(password.length > 0)) {
        throw new Error('Email or password was not provided');
    }
    const formData = new FormData();
    // OAuth2 expects form data, not JSON data
    formData.append('username', email);
    formData.append('password', password);

    const request = new Request(BASE_URL + '/api/token', {
        method: 'POST',
        body: formData,
    });

    const response = await fetch(request);

    if (response.status === 500) {
        throw new Error('Internal server error');
    }

    const data = await response.json();

    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }

    if ('access_token' in data) {
        const decodedToken = decodeJwt(data['access_token']);
        authContext.setLogin({permissions: decodedToken.permissions, token: data['access_token']});
    }

    return data;
};

/**
 * Sign up via backend and store JSON web token on success
 *
 * @param email: string
 * @param password: string
 * @param passwordConfirmation: string
 * @returns JSON data containing access token on success
 * @throws Error on http errors or failed attempts
 */
export const signUp = async (
    email,
    password,
    passwordConfirmation,
    authContext
) => {
    // Assert email or password or password confirmation is not empty
    if (!(email.length > 0)) {
        throw new Error('Email was not provided');
    }
    if (!(password.length > 0)) {
        throw new Error('Password was not provided');
    }
    if (!(passwordConfirmation.length > 0)) {
        throw new Error('Password confirmation was not provided');
    }

    const formData = new FormData();
    // OAuth2 expects form data, not JSON data
    formData.append('username', email);
    formData.append('password', password);

    const request = new Request(BASE_URL + '/api/signup', {
        method: 'POST',
        body: formData,
    });

    const response = await fetch(request);

    if (response.status === 500) {
        throw new Error('Internal server error');
    }

    const data = await response.json();
    if (response.status > 400 && response.status < 500) {
        if (data.detail) {
            throw data.detail;
        }
        throw data;
    }

    if ('access_token' in data) {
        const decodedToken = decodeJwt(data['access_token']);
        authContext.setLogin({permissions: decodedToken.permissions, token: data['access_token']});
    }

    return data;
};

export const logout = (authContext) => {
    authContext.clearLogin();
};
