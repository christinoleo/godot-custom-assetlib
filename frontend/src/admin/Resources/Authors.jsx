import React from 'react';
import './styles.css';

import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    ReferenceArrayField,
    ReferenceArrayInput,
    SelectArrayInput,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    UrlField, useInput,
} from 'react-admin';
import {Resource} from 'react-admin';
import {Field, useFormState} from "react-final-form";
import {TextField as MTextInput} from "@material-ui/core";
import {Chip, List as MList, ListItem, Grid} from "@material-ui/core";


export const authorMap2Str = list => {
    if (!list) return undefined;
    return list.map(e => e.first_name + ', ' + e.last_name).join(' and ')
};

export const authorStr2Map = str_value => {
    let ret = [];
    if (str_value.length <= 0) return ret;
    return str_value.split(' and ').map(author => {
        let author_split = author.split(',');
        if (author_split.length === 0) return {fist_name: '', last_name: ''};
        else if (author_split.length === 1) return {fist_name: '', last_name: author_split[0].trim()};
        else return {first_name: author_split[1].trim(), last_name: author_split[0].trim()};
    });
};

export const authorCit2Map = list => {
    if (!list) return [];
    return list.map(e => {
        if (!!e.literal) {
            let split = e.literal.split(',')
            return {
                first_name: split.length > 1 ? split[0].trim() : '',
                last_name: split.length > 1 ? split[1].trim() : e.literal.trim()
            };
        } else return {first_name: e.given, last_name: e.family};
    });
};

export const AuthorInput = (props) => {
    const {
        input: {name, onChange, value, ...rest},
        meta: {touched, error},
        isRequired
    } = useInput(props);
    let map_value;
    let str_value;
    if (typeof value === 'string' || value instanceof String) {
        str_value = value.toString();
        map_value = authorStr2Map(str_value);
    } else {
        map_value = value;
        str_value = authorMap2Str(value);
    }

    return (
        <>
            <MTextInput
                name={name}
                label={'Author'}
                key={'author_str'}
                onChange={onChange}
                error={!!(touched && error)}
                helperText={touched && error}
                variant="filled"
                fullWidth={props.fullWidth}
                style={{paddingBottom: '0.5em'}}
                value={str_value}
                {...rest}/>
            {map_value.map(e => <Chip label={e.last_name + ', ' + e.first_name}
                                      key={e.last_name + ', ' + e.first_name}/>)}
        </>
    );
};

const PostTitle = ({record}) => {
    return <span>Viewing Author {record ? `"${record.name}"` : ''}</span>;
};

const inputs = <>
    <TextInput source="first_name" fullWidth={true}/>
    <TextInput source="last_name" fullWidth={true}/>
</>;

const fields = (props = {}) => {
    return [
        <TextField source="id"/>,
        <TextField source="first_name" {...props}/>,
        <TextField source="last_name" {...props}/>,
    ]
};

/**
 * @param record.authors[]
 */
export const AuthorField = ({record = {}, small = true, ...props}) => {
    if (!!record && !!record.authors) {
        if (record.authors.length > 5 && small)
            return <Chip
                label={'many'}
                key={'many'}
                {...props}/>;
        return (
            <Grid container key={'author-grid'}>
                {record.authors.map(
                    a => <Grid item xs key={a.last_name + ', ' + a.first_name}>
                        <Chip label={a.last_name + ', ' + a.first_name} {...props}/>
                    </Grid>)}
            </Grid>);
    } else return <div/>
};

export const AuthorCreate = (props) => (
    <Create {...props}><SimpleForm>{inputs}</SimpleForm></Create>
);

export const AuthorEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" fullWidth={true}/>
            {inputs}
        </SimpleForm>
    </Edit>
);

export const AuthorList = (props) => (
    <List {...props}>
        <Datagrid rowClick="show">
            {fields()}
            <EditButton/>
        </Datagrid>
    </List>
);

export const AuthorShow = (props) => {
    return (
        <Show title={<PostTitle/>} {...props}>
            <SimpleShowLayout>
                {fields({fullWidth: true})}
                <EditButton/>
            </SimpleShowLayout>
        </Show>
    );
};

export const AuthorResource = () => (
    <Resource
        name="authors"
        list={AuthorList}
        edit={AuthorEdit}
        show={AuthorShow}
        create={AuthorCreate}
    />
);