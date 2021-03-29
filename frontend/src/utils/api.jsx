import React, { useEffect, useReducer, useRef } from 'react';
import { BACKEND_URL } from '../config';
import { isAuthenticated, logout } from './auth';
import { useHistory } from 'react-router';

export const getMessage = async () => {
    const response = await fetch(BACKEND_URL);

    const data = await response.json();

    if (data.message) {
        return data.message;
    }

    return Promise.reject('Failed to get message from backend');
};

// const reducer = (state, action) => {
//     if (!action) return { status: 'idle', loading: false, error: null, data: [], };
//     switch (action.status) {
//         case 'UNAUTHENTICATED':
//             return { status: 'unauthenticated', loading: false, data: [], error: null };
//         case 'FETCHING':
//             return { status: 'fetching', loading: true, data: [], error: null };
//         case 'FETCHED':
//             return { status: 'fetched', loading: false, data: action.data, error: null };
//         case 'FETCH_ERROR':
//             return { status: 'error', loading: false, data: [], error: action.error };
//         default:
//             return { status: 'idle', loading: false, error: null, data: [], };
//     }
// };

const cache = {};

const fetchData = async (url, { urlParams, fetchConfig, refresh, authenticated, permission, cancelRequest }) => {
    if (!url) return { status: 'FETCH_ERROR', error: 'No Url' };

    if (authenticated) {
        const auth = isAuthenticated();
        if ((!permission && !auth) || (!!permission && auth.permissions !== permission))
            return { status: 'UNAUTHENTICATED' };
        fetchConfig['headers']['Authorization'] = 'Bearer ' + auth.token;
    }

    const cacheKey = JSON.stringify({ url: url, params: urlParams, config: fetchConfig });
    if (!refresh && cache[cacheKey]) {
        const data = cache[cacheKey];
        return { status: 'FETCHED', data: data };
    } else {
        try {
            const response = await fetch(BACKEND_URL + url + '?' + new URLSearchParams(urlParams), fetchConfig);
            if (response.status === 401) return { status: 'UNAUTHENTICATED' };
            if (response.status === 403) return { status: 'FORBIDDEN' };
            const data = await response.json();
            console.log('fetch', BACKEND_URL + url + '?' + new URLSearchParams(urlParams), data, fetchConfig);
            cache[cacheKey] = data;
            return { status: 'FETCHED', data: data };
        } catch (error) {
            return { status: 'FETCH_ERROR', error: error.message };
        }
    }
};

export const customFetch = async (url, {
    filter = {}, range = [], sort = [], fields = [],
    fetchConfig = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: null,
    },
    refresh = true,
    authenticated = true,
    permission = null, cancelRequest = null
}) => {
    let params = {};
    if (Object.keys(filter).length > 0) params['filter'] = JSON.stringify(filter);
    if (sort.length > 0) params['sort'] = JSON.stringify(sort);
    if (range.length > 0) params['range'] = JSON.stringify(range);
    if (fields.length > 0) params['fields'] = JSON.stringify(fields);
    try {
        let data = await fetchData(url, { urlParams: params, fetchConfig, refresh, authenticated, permission, cancelRequest });
        console.log('customFetch', data);
        if (data.status === 'UNAUTHENTICATED' || data.status === 'FORBIDDEN') {
            logout();
            throw new Error(data.status);
        }
        return data;
    } catch (e) {
        console.log('customFetch Error', e);
        throw e;
    }
};

export const useFetch = (url,
    {
        filter = {}, range = [], sort = [], fields = [],
        fetchConfig = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: null,
        },
        refresh = true,
        authenticated = true,
        permission = null,
    }) => {
    const cache = useRef({});
    const history = useHistory();

    const [state, dispatch] = useReducer(reducer, {});

    useEffect(() => {
        let cancelRequest = false;
        dispatch({ status: 'FETCHING' });
        customFetch(url, { filter, range, sort, fields, fetchConfig, cache, refresh, authenticated, permission, cancelRequest })
            .then(data => {
                dispatch(data);
            })
            .catch(data => dispatch(data));

        return () => {cancelRequest = true;};
    }, [url, fetchConfig.body]);

    return state;
};

export const myDataProvider = ({ refresh, authenticated, permission } = {
    refresh: true,
    authenticated: true,
    permission: null
}) => {
    const get = (url, { filter = {}, range = [], sort = [], fields = [] }) =>
        customFetch(url, { filter, range, sort, fields, refresh, authenticated, permission });
    const post = (url, { filter = {}, range = [], sort = [], fields = [], body }) =>
        customFetch(url, {
            filter, range, sort, fields, fetchConfig: {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            }, refresh, authenticated, permission,
        });

    return { get, post };
};

export const useMyDataProvider = (provider) => {

};