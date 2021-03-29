import React from 'react';
import './styles.css';

import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    Resource,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    UrlField,
    useInput
} from 'react-admin';
import {useFormState} from 'react-final-form';
import {authorCit2Map, AuthorField, AuthorInput, authorMap2Str, authorStr2Map} from "./Authors";
import {MyTextInput} from "../../components/Material";
import { Toolbar } from 'react-admin';
import { SaveButton } from 'react-admin';
import { BooleanInput } from 'react-admin';

const Cite = require('citation-js');


const inputs = () => [
    <TextInput source="notes" options={{multiline: true}} fullWidth={true}/>,
];

const fields = ({bibtex = true, small = true, props} = {}) => {
    return <TextField source="id"/>;
};

// export const PublicationCreate = (props) => (
//     <Create {...props}>
//         <SimpleForm>{inputs()}</SimpleForm>
//     </Create>
// );
//
//
// export const PublicationEdit = (props) => {
//     return (
//         <Edit {...props}>
//             <SimpleForm>
//                 <TextInput disabled source="id" fullWidth={true}/>
//                 {inputs()}
//             </SimpleForm>
//         </Edit>
//     );
// }
//
// export const PublicationList = (props) => (
//     <List {...props}>
//         <Datagrid rowClick="show">
//             {fields({cellClassName: 'limited-textfield', bibtex: false})}
//             <EditButton/>
//         </Datagrid>
//     </List>
// )

export const ProjectPublicationCustomEdit = (publication, props={}) =>
    [<MyTextInput title='Project-wise Summary' defaultValue={publication.notes}/>,
        <MyTextInput title='Project-wise Notes' defaultValue={publication.notes}/>,
    ];


export const ProjectPublicationEdit = (props) => (
    <Edit  title="Project Publication Edit" {...props}>
        <SimpleForm {...props}>
            <TextField source='id'/>
            <TextInput source='summary' options={{multiline: true}} fullWidth/>
            <TextInput source='notes' options={{multiline: true}} fullWidth/>
            <BooleanInput source="inserted" />
        </SimpleForm>
    </Edit>
);


export const ProjectPublicationShow = (props) => (
    <Show title="Project Publication Show" {...props}>
        <SimpleShowLayout>
            <EditButton/>
        </SimpleShowLayout>
    </Show>
);

export const ProjectPublicationResource = () => {
    return <Resource
        name="project_publication_association"
        // list={ProjectPublicationList}
        edit={ProjectPublicationEdit}
        show={ProjectPublicationShow}
        // create={ProjectPublicationCreate}
    />
};



