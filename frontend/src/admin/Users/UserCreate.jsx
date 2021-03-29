import React from 'react';
import {BooleanInput, Create, PasswordInput, SimpleForm, TextInput,} from 'react-admin';

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="email"/>
            <TextInput source="first_name"/>
            <TextInput source="last_name"/>
            <PasswordInput source="password"/>
            <BooleanInput source="is_superuser"/>
            <BooleanInput source="is_active"/>
        </SimpleForm>
    </Create>
);
