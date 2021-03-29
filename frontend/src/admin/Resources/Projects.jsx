import React, {Fragment, useState, cloneElement} from 'react';
import './styles.css';
import {connect} from "react-redux";
import {push} from "react-router-redux";
import {change, submit, isSubmitting} from 'redux-form';
import {useHistory} from "react-router-dom";

import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    showNotification,
    crudGetMatching,
    fetchEnd,
    fetchStart,
    ReferenceArrayField,
    ReferenceArrayInput,
    SelectArrayInput,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    SimpleFormIterator,
    UrlField,
    ArrayInput,
    DateInput,
    FormDataConsumer,
    useInput,
    SaveButton,
    BooleanField,
    BulkDeleteButton,
    useRefresh,
    useNotify,
    useUpdateMany,
    useUnselectAll,
    Resource, Filter
} from 'react-admin';
import {ReferenceInput} from 'react-admin';
import {SelectInput} from 'react-admin';
import {PublicationEdit, PublicationInputs, PublicationShow} from "./Publications";
import {authorCit2Map, authorMap2Str} from "./Authors";
import {Chip, Grid} from "@material-ui/core";
import {TextField as MTextInput, Card, CardContent, CardHeader, Button as MButton} from "@material-ui/core";
import {Button} from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import CreateIcon from '@material-ui/icons/Create';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {MyTextInput} from "../../components/Material";
import {PublicationFields} from "./Publications";
import {ProjectPublicationCustomEdit, ProjectPublicationEdit} from "./ProjectPublication";
import {Confirm} from 'react-admin';
import {Pagination} from 'react-admin';
import {BooleanInput} from 'react-admin';


const Cite = require('citation-js');

const PostTitle = ({record}) => {
    return <span>Viewing Project {record ? `"${record.name}"` : ''}</span>;
};

const inputs = <>
    <TextInput source="name" fullWidth={true}/>
    <TextInput source="overleaf" fullWidth={true}/>
</>;

const fields = ({small = false, ...props}) => [
    <TextField source="id" key='id'/>,
    <TextField source="name" key='name' {...props}/>,
    <UrlField source="overleaf" key='overleaf' {...props}/>,
];

const transform = data => {
    let ret = {...data};
    if (!!ret.publications_bibtex && ret.publications_bibtex !== '') {
        if (!ret.publications) ret.publications = [];
        let new_citations = new Cite(ret.publications_bibtex).get();
        new_citations = new_citations.map(e => {
            e['citation'] = e['citation-label'];
            e['journal'] = e['container-title'];
            e['authors'] = authorCit2Map(e.author);
            e['bibtex'] = new Cite(e).format('bibtex').trimEnd();
            e['id'] = null;
            return {publication: e};
        });
        ret.publications.push(...new_citations);
    }
    return ret;
};

const PublicationBulkEdit = (props) => {
    const selectedIds = props.selectedIds || [];
    const [openConfirm, setOpenConfirm] = useState({
        isOpen: false,
        onConfirm: null,
        onClose: null,
        title: 'Update Publications',
        content: null,
        loading: null
    });
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();
    const onSuccess = () => {
        refresh();
        notify('Publications Updated');
        unselectAll('project_publication_association');
    };
    const onFailure = error => notify('Error: posts not updated', 'warning')
    const [updateManyInsertedFalse, dataUpdateManyInsertedFalse] = useUpdateMany('project_publication_association', selectedIds, {inserted: false}, {
        onSuccess,
        onFailure,
    });
    const [updateManyInsertedTrue, dataUpdateManyInsertedTrue] = useUpdateMany('project_publication_association', selectedIds, {inserted: true}, {
        onSuccess,
        onFailure,
    });

    const setOpenConfirmFalse = (callback = null) => {
        if (!!callback) callback();
        setOpenConfirm({...openConfirm, isOpen: false});
    };

    return (
        <Fragment>
            <MButton color="primary" onClick={c => setOpenConfirm({
                ...openConfirm,
                isOpen: true,
                onConfirm: c => setOpenConfirmFalse(updateManyInsertedTrue),
                onClose: c => setOpenConfirmFalse(),
                content: 'Are you sure you want to set these publications as included in the paper?',
                loading: dataUpdateManyInsertedTrue.loading,
            })}>Set Inserted</MButton>
            <MButton color="primary" onClick={c => setOpenConfirm({
                ...openConfirm,
                isOpen: true,
                onConfirm: c => setOpenConfirmFalse(updateManyInsertedFalse),
                onClose: c => setOpenConfirmFalse(),
                content: 'Are you sure you want to set these publications as NOT included in the paper?',
                loading: dataUpdateManyInsertedFalse.loading,
            })}>Set Not Inserted</MButton>
            {/* default bulk delete action */}
            <BulkDeleteButton {...props} />
            {openConfirm.isOpen && <Confirm {...openConfirm}/>}
        </Fragment>);
};

const PublicationFieldShow = ({record = {}, id, show, onClose, isSubmitting, ...props}) => {
    const history = useHistory();
    if (!record || !record.id) return <div/>;
    const publication = record.publication;

    return (
        <Fragment>
            <Dialog fullWidth
                    maxWidth='lg'
                    open={show}
                    onClose={v => onClose()}>
                <DialogTitle>Publication {publication.citation}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs>
                            <ProjectPublicationEdit basepath='/project_publication_association'
                                                    resource='project_publication_association'
                                                    actions={<div/>}
                                                    redirect={(basePath, id, data) => onClose()}
                                                    id={record.id} {...props}/>
                        </Grid>
                        <Grid item xs>
                            <PublicationShow {...props} basepath='/publications'
                                             resource='publications'
                                             id={publication.id}
                                             record={publication}
                                             actions={<div/>}
                                             onEditClick={e => {
                                                 history.push('/publications/' + publication.id);
                                                 e.stopPropagation();
                                             }}>
                            </PublicationShow>
                            {/*<SimpleShowLayout basepath="/publications"*/}
                            {/*                  resource="publications"*/}
                            {/*                  id={publication.id}*/}
                            {/*                  record={publication}*/}
                            {/*                  {...props}>*/}
                            {/*    {PublicationFields()}*/}
                            {/*    <Button basepath="/publication"*/}
                            {/*            record={publication}*/}
                            {/*            id={publication.id}*/}
                            {/*            label="ra.action.edit"*/}
                            {/*            onClick={c => props.push('/publications/' + publication.id)}><CreateIcon/></Button>*/}
                            {/*</SimpleShowLayout>*/}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

const PublicationFilter = (props) => (
    <Filter {...props}>
        {/*<TextInput label="Search" source="q" alwaysOn />*/}
        <TextInput label="Title" source="publication.title"/>
        <TextInput label="Citation" source="publication.citation"/>
        <TextInput label="Journal" source="publication.journal"/>
        <TextInput label="Notes" source="publication.notes"/>
        <BooleanInput label="Inserted" source="inserted"/>
    </Filter>
);

const PublicationField = ({record = {}, data, resource, small = false, ...props}) => {
    const [showModal, setShowModal] = useState({show: false, record: null, id: null});

    if (!!record && !!record.publications) {
        return (
            <Card style={{width: '60vw'}}>
                <CardHeader title="Publications within project" style={{paddingBottom: 0}}/>
                <CardContent style={{paddingTop: 0}}>
                    <List resource='project_publication_association'
                          basePath='/project_publication_association'
                          basepath='/project_publication_association'
                          filter={{project_id: record.id}}
                          label='Publications'
                          title='Publications'
                          filters={<PublicationFilter/>}
                          pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]}/>}
                          {...props}
                          bulkActionButtons={<PublicationBulkEdit/>}>
                        <Datagrid
                            rowClick={(id, basePath, record) => setShowModal({show: true, record: record, id: id})}>
                            <TextField source="publication.title" label='Title'/>
                            <TextField source="publication.citation" label='Citation'/>
                            <BooleanField source="inserted" label='Inserted'/>
                        </Datagrid>
                    </List>
                    <PublicationFieldShow record={showModal.record}
                                          id={showModal.id}
                                          show={showModal.show}
                                          onClose={v => setShowModal({...showModal, show: false})}
                                          {...props}/>
                </CardContent>
            </Card>);
    } else return <div/>
};

const PublicationInputField = ({record = {}, onEditClick = null, ...props}) => {
    if (!record || !record['publication']) return <div/>;

    return <Card style={{margin: '1em 1em 1em 1em', backgroundColor: '#f7f7f7'}}>
        <CardContent>
            <MTextInput
                label={'Citation Label'}
                key={props.label}
                style={{paddingBottom: '0.5em'}}
                value={record['publication'].citation}
                InputProps={{
                    readOnly: true,
                }}
                {...props}/>
            <MTextInput
                label={'Title'}
                key={props.label}
                style={{paddingBottom: '0.5em'}}
                value={record['publication'].title}
                InputProps={{
                    readOnly: true,
                }}
                {...props}/>
            <MTextInput
                label={'Authors'}
                key={props.label}
                style={{paddingBottom: '0.5em'}}
                value={authorMap2Str(record['publication'].authors)}
                InputProps={{
                    readOnly: true,
                }}
                {...props}/>
            <MTextInput
                label={'Summary'}
                key={props.label}
                style={{paddingBottom: '0.5em'}}
                value={authorMap2Str(record['publication']['summary'])}
                {...props}/>
            <Edit onEditClick={onEditClick} {...props}>
                <SimpleForm>
                    <MTextInput
                        label={'Project Summary'}
                        key={props.label}
                        style={{paddingBottom: '0.5em'}}
                        value={authorMap2Str(record['summary'])}
                        {...props}/>
                </SimpleForm>
            </Edit>
        </CardContent>
    </Card>
};

export const ProjectCreate = (props) => (
    <Create transform={transform} {...props}><SimpleForm>{inputs}</SimpleForm></Create>
);

export const ProjectEdit = (props) => (
    <Edit transform={transform} {...props}>
        <SimpleForm>
            <TextInput disabled source="id" fullWidth={true}/>
            {inputs}
            <ArrayInput source="publications">
                <SimpleFormIterator disableAdd>
                    <FormDataConsumer>
                        {({getSource, formData, scopedFormData}) => {
                            return (
                                <PublicationInputField
                                    source={getSource('title')}
                                    record={scopedFormData}
                                    fullWidth={true}
                                />
                            );
                        }}
                    </FormDataConsumer>
                </SimpleFormIterator>
            </ArrayInput>
            <ReferenceArrayInput source="publication_ids"
                                 reference="publications"
                                 label='Add existing publications'
                                 fullWidth={true}
                                 sort={{field: 'title', order: 'DESC'}}
                                 allowEmpty>
                <SelectArrayInput optionText="title"/>
            </ReferenceArrayInput>
            <TextInput label='Enter bibtex list to add new publications'
                       source='publications_bibtex'
                       fullWidth={true} options={{multiline: true}}/>
        </SimpleForm>
    </Edit>
);

export const ProjectList = ({rowClick = "show", ...props}) => (
    <List {...props}>
        <Datagrid rowClick={rowClick} {...props}>
            {fields({small: true})}
            {!props.noEditButton && <EditButton/>}
        </Datagrid>
    </List>
)

export const ProjectShow = connect(undefined, {
})(({...props}) => {
    return (
        <Show title={<PostTitle/>} aside={<PublicationField source="publications" {...props}/>} {...props}>
            <SimpleShowLayout>
                {fields({small: false, fullWidth: true})}
                <EditButton/>
            </SimpleShowLayout>
        </Show>
    );
});

export const ProjectResource = () => (
    <Resource
        name="projects"
        list={ProjectList}
        edit={ProjectEdit}
        show={ProjectShow}
        create={ProjectCreate}
    />
);