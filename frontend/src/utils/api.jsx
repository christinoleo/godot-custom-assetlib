import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { BACKEND_URL } from '../config';
import { AuthContext } from './auth';

export const getMessage = async () => {
    const response = await fetch(BACKEND_URL);

    const data = await response.json();

    if (data.message) {
        return data.message;
    }

    return Promise.reject('Failed to get message from backend');
};

const cache = {};

const fetchData = async (url, { urlParams, fetchConfig, refresh, authtoken }) => {
    if (!url) return { status: 'FETCH_ERROR', error: 'No Url' };

    if (!authtoken) {
        return { status: 'UNAUTHENTICATED' };
    } else fetchConfig['headers']['Authorization'] = 'Bearer ' + authtoken;

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
            if(process.env.NODE_ENV === 'development')
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
    authtoken = null,
    cancelRequest = null
}) => {
    let params = {};
    if (Object.keys(filter).length > 0) params['filter'] = JSON.stringify(filter);
    if (sort.length > 0) params['sort'] = JSON.stringify(sort);
    if (range.length > 0) params['range'] = JSON.stringify(range);
    if (fields.length > 0) params['fields'] = JSON.stringify(fields);
    try {
        let data = await fetchData(url, { urlParams: params, fetchConfig, refresh, authtoken, cancelRequest });
        if(process.env.NODE_ENV === 'development')
            console.log('customFetch', data);
        return data;
    } catch (e) {
        console.log('customFetch Error', e);
        throw e;
    }
};

export const myDataProvider = ({ refresh, admin, permission } = {
    refresh: true,
    admin: true,
    permission: null
}) => {
    const authContext = useContext(AuthContext);
    let authtoken;
    if((admin && authContext.isAdmin()) || (!admin && authContext.isAuthenticated())){
        authtoken = authContext.token;
    }

    const get = (url, { filter = {}, range = [], sort = [], fields = [] }) =>
        customFetch(url, { filter, range, sort, fields, refresh, authtoken });
    const post = (url, { filter = {}, range = [], sort = [], fields = [], body }) =>
        customFetch(url, {
            filter, range, sort, fields, fetchConfig: {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            }, refresh, authtoken,
        });

    return { get, post };
};

export const useMyDataProvider = (provider) => {

};