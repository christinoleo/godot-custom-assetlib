// in src/users.js
import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    BooleanField,
    EmailField,
    EditButton,
} from 'react-admin';

export const UserList = (props) => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id"/>
            <EmailField source="email"/>
            <TextField source="first_name"/>
            <TextField source="last_name"/>
            <BooleanField source="is_active"/>
            <BooleanField source="is_superuser"/>
            <EditButton/>
        </Datagrid>
    </List>
);
