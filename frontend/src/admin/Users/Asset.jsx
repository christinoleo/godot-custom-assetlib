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

export const AssetCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="id"/>
            <TextInput source="icon_url" title='title'/>
            <NumberInput disabled source="id"/>
            <TextInput source="title"/>
            <TextInput source="type"/>
            <TextInput source="author"/>
            <NumberInput source="author_id"/>
            <TextInput source="category"/>
            <TextInput source="category_id"/>
            <TextInput source="godot_version"/>
            <NumberInput source="rating"/>
            <TextInput source="cost"/>
            <TextInput source="support_level"/>
            <TextInput source="version"/>
            <TextInput source="version_string"/>
            <DateInput source="modify_date"/>
            <TextInput source="description"/>
            <TextInput source="download_provider"/>
            <TextInput source="download_commit"/>
            <TextInput  source="browse_url"/>
            <TextInput  source="issues_url"/>
            <NumberInput source="searchable"/>
            <TextInput  source="download_url"/>
            <TextInput source="previews"/>
            <TextInput source="download_hash"/>
        </SimpleForm>
    </Create>
);

export const AssetEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id"/>
            <TextInput source="icon_url" title='title'/>
            <NumberInput disabled source="id"/>
            <TextInput source="title"/>
            <TextInput source="type"/>
            <TextInput source="author"/>
            <NumberInput source="author_id"/>
            <TextInput source="category"/>
            <TextInput source="category_id"/>
            <TextInput source="godot_version"/>
            <NumberInput source="rating"/>
            <TextInput source="cost"/>
            <TextInput source="support_level"/>
            <TextInput source="version"/>
            <TextInput source="version_string"/>
            <DateInput source="modify_date"/>
            <TextInput source="description"/>
            <TextInput source="download_provider"/>
            <TextInput source="download_commit"/>
            <TextInput  source="browse_url"/>
            <TextInput  source="issues_url"/>
            <NumberInput source="searchable"/>
            <TextInput  source="download_url"/>
            <TextInput source="previews"/>
            <TextInput source="download_hash"/>
        </SimpleForm>
    </Edit>
);

export const AssetList = (props) => (
    <List {...props}>
        <Datagrid rowClick="show">
            <ImageField source="icon_url" title='title'/>
            <NumberField source="id"/>
            <TextField source="title"/>
            <TextField source="type"/>
            <TextField source="author"/>
            <TextField source="category"/>
            <TextField source="godot_version"/>
            <NumberField source="rating"/>
            <TextField source="cost"/>
            <TextField source="support_level"/>
            <TextField source="version"/>
            <DateField source="modify_date"/>
            <EditButton/>
        </Datagrid>
    </List>
);

export const AssetShow = (props) => (
    <Show title="Asset Show" {...props}>
        <SimpleShowLayout>
            <ImageField source="icon_url" title='title'/>
            <NumberField source="id"/>
            <TextField source="title"/>
            <TextField source="type"/>
            <TextField source="author"/>
            <NumberField source="author_id"/>
            <TextField source="category"/>
            <TextField source="category_id"/>
            <TextField source="godot_version"/>
            <NumberField source="rating"/>
            <TextField source="cost"/>
            <TextField source="support_level"/>
            <TextField source="version"/>
            <TextField source="version_string"/>
            <DateField source="modify_date"/>
            <TextField source="description"/>
            <TextField source="download_provider"/>
            <TextField source="download_commit"/>
            <UrlField  source="browse_url"/>
            <UrlField  source="issues_url"/>
            <NumberField source="searchable"/>
            <UrlField  source="download_url"/>
            <TextField source="previews"/>
            <TextField source="download_hash"/>
        </SimpleShowLayout>
    </Show>
);

export const AssetResource = (props) => {
    return <Resource
        name="assets"
        list={AssetList}
        edit={AssetEdit}
        create={AssetCreate}
        show={AssetShow}
    />
};