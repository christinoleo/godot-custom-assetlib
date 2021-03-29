import React from 'react';
import {Resource} from 'react-admin';
import {
    BooleanField,
    BooleanInput,
    Create,
    Datagrid,
    Edit,
    EditButton,
    EmailField,
    List,
    PasswordInput,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    ImageField,
    DateField,
    UrlField,
    NumberField,
    NumberInput,
    DateInput,
    ImageInput
} from 'react-admin';

export const CategoryCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id"/>
            <TextInput source="name"/>
            <NumberInput source="type"/>
        </SimpleForm>
    </Create>
);

export const CategoryEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id"/>
            <TextInput source="name"/>
            <NumberInput source="type"/>
        </SimpleForm>
    </Edit>
);

export const CategoryList = (props) => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id"/>
            <TextField source="name"/>
            <NumberField source="type"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const CategoryShow = (props) => (
    <Show title="Category Show" {...props}>
        <SimpleShowLayout>
            <TextField source="id"/>
            <TextField source="name"/>
            <NumberField source="type"/>
        </SimpleShowLayout>
    </Show>
);

export const CategoryResource = (props) => {
    return <Resource
        name="categories"
        list={CategoryList}
        edit={CategoryEdit}
        create={CategoryCreate}
        show={CategoryShow}
    />
};