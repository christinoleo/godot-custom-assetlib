import React from 'react';
import {Admin as ReactAdmin, fetchUtils, Resource} from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import authProvider from './authProvider';
import PostIcon from '@material-ui/icons/Book';

import {BACKEND_URL} from '../config';
import {UserCreate, UserEdit, UserList, UserShow} from './Users';
import {PublicationResource} from "./Resources/Publications";
import {ProjectResource} from "./Resources/Projects";
import {AuthorResource} from "./Resources/Authors";
import {ProjectPublicationResource} from "./Resources/ProjectPublication";

const httpClient = (url, options) => {
    if (!options) {
        options = {};
    }
    if (!options.headers) {
        options.headers = new Headers({Accept: 'application/json'});
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', `Bearer ${token}`);
    try {console.log('call', url, JSON.parse(options.body))} catch (e) {}
    try {return fetchUtils.fetchJson(url, options)} catch (e) {
        console.log(e);
        throw e;
    }
};

const dataProvider = simpleRestProvider(BACKEND_URL, httpClient);

export const Admin = () => {
    const admin_resources = [
        <Resource
            name="users"
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
            icon={PostIcon}
            show={UserShow}
        />, PublicationResource(), ProjectResource(), AuthorResource(), ProjectPublicationResource(),
    ];

    return (
        <ReactAdmin dataProvider={dataProvider} authProvider={authProvider}>
            {(permissions) => [
                permissions === 'admin' ? admin_resources : null,
            ]}
        </ReactAdmin>
    );
};
