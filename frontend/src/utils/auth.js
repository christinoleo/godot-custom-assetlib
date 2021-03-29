import decodeJwt from 'jwt-decode';
import { BASE_URL } from '../config';

export const AUTH_ADMIN = 'admin';
export const AUTH_USER = 'user';

export const isAuthenticated = () => {
    const permissions = localStorage.getItem('permissions');
    if (!permissions || (permissions !== AUTH_ADMIN && permissions !== AUTH_USER)) {
        return false;
    }
    return { token: localStorage.getItem('token'), permissions: permissions };
};

/**
 * Login to backend and store JSON web token on success
 *
 * @param email: string
 * @param password: string
 * @returns JSON data containing access token on success
 * @throws Error on http errors or failed attempts
 */
export const login = async (email, password) => {
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
        localStorage.setItem('token', data['access_token']);
        localStorage.setItem('permissions', decodedToken.permissions);
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
    passwordConfirmation
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
        localStorage.setItem('token', data['access_token']);
        localStorage.setItem('permissions', decodedToken.permissions);
    }

    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
};
