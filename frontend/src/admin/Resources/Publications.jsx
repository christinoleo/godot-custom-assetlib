import React, {Fragment, useState} from 'react';
import './styles.css';

import {
    ArrayInput,
    BulkDeleteButton, Confirm,
    Create,
    Datagrid,
    Edit,
    EditButton, FormDataConsumer,
    List, Pagination, ReferenceArrayInput,
    Resource, SelectArrayInput,
    Show,
    SimpleForm, SimpleFormIterator,
    SimpleShowLayout,
    TextField,
    TextInput,
    UrlField,
    useInput, useNotify, useRefresh, useUnselectAll, useUpdateMany
} from 'react-admin';
import {useFormState} from 'react-final-form';
import {authorCit2Map, AuthorField, AuthorInput, authorMap2Str, authorStr2Map} from "./Authors";
import {Filter} from 'react-admin';
import {MyTextInput} from "../../components/Material";
import {
    Button as MButton,
    Grid,
    Select as MSelect,
    MenuItem as MMenuItem,
    TextField as MTextInput,
    InputLabel as MInputLabel,
    Link as MLink,
} from "@material-ui/core";
import {Button} from 'react-admin';
import CreateIcon from '@material-ui/icons/Create';
import {useGetList} from 'react-admin';
import {useCreate} from 'react-admin';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {ProjectPublicationEdit} from "./ProjectPublication";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import {ProjectList} from "./Projects";
import {Toolbar} from 'react-admin';
import {TopToolbar} from 'react-admin';
import {useHistory} from 'react-router-dom';
import {ReferenceInput} from 'react-admin';
import {SelectInput} from 'react-admin';
import {Loading} from 'react-admin';
import {CustomToolbar} from '../../components/CustomToolbar';
import {CustomReferenceArrayInput, CustomSelectArrayInput} from "../../components/Data/CustomReferenceArrayInput";
import {EmptyTextInput} from "../../components/Data/CustomInputs";
import {SimpleLimitedTextField} from "../../components/Data/CustomFields";
import {DateField} from 'react-admin';


const Cite = require('citation-js');

let _values = null;

const FollowBibtexTextInput = ({bibtexJsonLabel = null, ...props}) => {
    const {values, modified, ...rest} = useFormState();
    const name = props.source;
    if (bibtexJsonLabel === null) bibtexJsonLabel = name;
    if (!!modified && modified[name] && (!_values || _values[name] !== values[name])) {
        console.log('mod', !!_values ? _values[name] : '', values[name])
        try {
            let bibtex = new Cite(values.bibtex);
            let bibtexJson = bibtex.get()[0];
            bibtexJson[bibtexJsonLabel] = values[name];
            console.log('mod', bibtexJson, values.bibtex, new Cite(bibtexJson).format('bibtex').trimEnd())
            values.bibtex = new Cite(bibtexJson).format('bibtex').trimEnd();
            _values = values;
        } catch (e) {
            console.log('bad bibtex mod');
        }
    }

    return (
        <TextInput {...props}/>
    );
}


const BibtexInput = (props) => {
    const {values, modified} = useFormState();
    const name = props.source;
    if (!!modified && modified[name] && (!_values || _values[name] !== values[name])) {
        if (!!_values) _values = values;
        console.log('bib', values, values.bibtex)
        try {
            let bibtex = new Cite(values.bibtex);
            let bibtexJson = bibtex.get()[0];
            values.bibtex = bibtex.format('bibtex').trimEnd();
            values.citation = bibtexJson['citation-label'];
            values.title = bibtexJson.title;
            values.journal = bibtexJson['container-title'];
            values.author_map = authorCit2Map(bibtexJson.author);
            values.authors = authorMap2Str(values.author_map);
            if (!!bibtexJson['DOI']) values.link = 'https://doi.org/' + bibtexJson['DOI'];
            if (!!bibtexJson['URL']) values.link = bibtexJson['URL'];
            console.log(bibtexJson)
            _values = values;
        } catch (e) {
            console.log('bad bibtex', e.toString());
        }
    }
    return (
        <TextInput {...props}/>
    );
}

const bibtexValidate = (formData) => {
    const errors = {};
    try {
        let bibtex = new Cite(formData.bibtex);
        formData.bibtex = bibtex.format('bibtex').trimEnd();
        // console.log('validate', bibtex.get()[0]);
    } catch (e) {
        errors.bibtex = ['Bibtex invalid'];
    }
    console.log('validate', errors);
    return errors;
};

export const PublicationInputs = () => [
    <FollowBibtexTextInput source="citation" fullWidth={true} bibtexJsonLabel='citation-label'/>,
    <FollowBibtexTextInput source="title" fullWidth={true}/>,
    <AuthorInput source='authors' fullWidth={true}/>,
    <FollowBibtexTextInput source="journal" fullWidth={true} bibtexJsonLabel='container-title'/>,
    <FollowBibtexTextInput source="link" fullWidth={true} bibtexJsonLabel='URL'/>,
    <BibtexInput source="bibtex" options={{multiline: true}} fullWidth={true}/>,
    <EmptyTextInput source="abstract" options={{multiline: true}} fullWidth={true}/>,
    <EmptyTextInput source="summary" options={{multiline: true}} fullWidth={true}/>,
    <EmptyTextInput source="notes" options={{multiline: true}} fullWidth={true}/>,
    <TextInput source="keywords" fullWidth={true}/>,
];


export const PublicationListFields = (props = {}) => [
    <TextField source="id" key='id'/>,
    <TextField source="title" key='title' {...props}/>,
    // <AuthorField source="authors" key='authors' small={true} {...props} />,
    <TextField source="journal" key='journal' {...props} />,
    <SimpleLimitedTextField {...props} length={20} source="link" key='link' useLabel={false}>
        {(record, value) => <MLink href={record.link} onClick={(e)=>e.stopPropagation()}>{value}</MLink>}
    </SimpleLimitedTextField>,
    <SimpleLimitedTextField {...props} source="notes" key='notes' useLabel={false}/>,
    <SimpleLimitedTextField source="summary" key='summary' useLabel={false} {...props} />,
    <TextField {...props} source="keywords" key='keywords' label='keywords'/>,
    <DateField {...props} source="time_created" key='time_created' showTime={true}/>,
    <DateField {...props} source="time_updated" key='time_updated' showTime={true}/>,
];

export const PublicationFields = (props = {}) => [
    <TextField source="id" key='id'/>,
    <TextField source="title" key='title' {...props}/>,
    <AuthorField source="authors" key='authors' small={false} {...props} />,
    <TextField source="journal" key='journal' {...props} />,
    <UrlField source="link" key='link' {...props} />,
    <TextField source="bibtex" key='bibtex' {...props} />,
    <TextField source="summary" key='summary' {...props} />,
    <TextField source="abstract" key='abstract' {...props} />,
    <TextField {...props} source="notes" key='notes' label='notes'/>,
    <TextField {...props} source="keywords" key='keywords' label='keywords'/>,
    <DateField {...props} source="time_created" key='time_created' showTime={true}/>,
    <DateField {...props} source="time_updated" key='time_updated' showTime={true}/>,
];

export const PublicationFilter = (props) => (
    <Filter {...props}>
        {/*<TextInput label="Search" source="q" alwaysOn />*/}
        <TextInput label="Title" source="title"/>
        <TextInput label="Citation" source="citation"/>
        <TextInput label="Journal" source="journal"/>
        <TextInput label="Notes" source="notes"/>
        <TextInput label="Keywords" source="keywords"/>
        <ReferenceInput label="Project" source="project_publication_association.project_id" reference="projects" alwaysOn>
            <SelectInput optionText="name"/>
        </ReferenceInput>
    </Filter>
);

const PublicationBulkEdit = (props) => {
    const selectedIds = props.selectedIds || [];
    const [openConfirm, setOpenConfirm] = useState({open: false, id: null, record: {name: '', id: null}});
    const [open, setOpen] = useState(false);
    const [create, {loading: createLoading}] = useCreate('project_publication_association');
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll();

    return (
        <Fragment>
            <MButton onClick={c => setOpen(true)}>Add to Project</MButton>
            {/* default bulk delete action */}
            <BulkDeleteButton {...props} />
            <Dialog fullWidth
                    maxWidth='lg'
                    open={open}
                    onClose={v => setOpen(false)}>
                <DialogTitle>Select a project to add the publication to</DialogTitle>
                <DialogContent>
                    <ProjectList basePath='/projects'
                                 resource='projects'
                                 rowClick={(id, basePath, record) => setOpenConfirm({
                                     ...openConfirm,
                                     open: true,
                                     id: id,
                                     record: record
                                 })}
                                 isRowSelectable={c => false}
                                 bulkActionButtons={<div/>}
                                 actions={<div/>}
                                 noEditButton={true}
                    />
                </DialogContent>
            </Dialog>
            <Confirm
                isOpen={openConfirm.open}
                onConfirm={c => {
                    selectedIds.forEach(publication_id => {
                        if (!!openConfirm.record && !!openConfirm.record.id)
                            create({
                                payload: {
                                    data: {
                                        project_id: openConfirm.record.id,
                                        publication_id: publication_id
                                    }
                                }
                            });
                    });

                    setOpenConfirm({...openConfirm, open: false});
                    setOpen(false);
                    refresh();
                    notify('Publications Added to project ' + openConfirm.record.name);
                    unselectAll('project_publication_association');
                }}
                onClose={c => setOpenConfirm({...openConfirm, open: false})}
                title={'Are you sure?'}
                content={'Add Publications to Project ' + openConfirm.record.name + '?'}
                loading={createLoading}
            />
        </Fragment>
    );
};

const PublicationShowToolbar = ({onEditClick = null, data = null, resource = {}, ...props}) => {
    return <TopToolbar>
        {!onEditClick && <EditButton basePath="/publications" record={data}/>}
        {onEditClick &&
        <Button {...props} basepath="/publications" label="ra.action.edit" onClick={onEditClick}>
            <CreateIcon/>
        </Button>}
    </TopToolbar>
};

const transform = data => {
    let ret = {...data};
    ret.authors = ret.author_map;
    delete ret['author_map'];
    if (!ret.authors && !!ret.bibtex) {
        ret.authors = authorCit2Map(new Cite(ret.bibtex).get()[0].author);
    }
    if (!ret.notes) ret.notes = '';
    if (!ret.summary) ret.summary = '';
    return ret;
};

export const PublicationCreate = (props) => (
    <Create {...props}>
        <SimpleForm toolbar={<CustomToolbar transform={transform} {...props}/>}>
            {PublicationInputs()}
            <CustomReferenceArrayInput source='projects' order={{field: 'title', order: 'DESC'}}>
                <CustomSelectArrayInput reference='project_ids' name='Projects to be included in'
                                        setValues={(values, record) => values.filter(e => e.publications.filter(ee => ee.publication_id == record['id']).length > 0).map(e => e.id)}
                />
            </CustomReferenceArrayInput>
        </SimpleForm>
    </Create>
);


export const PublicationEdit = (props) => {
    const history = useHistory();
    return (
        <Edit {...props}>
            <SimpleForm redirect={() => {
                history.goBack();
            }} toolbar={<CustomToolbar transform={transform} {...props}/>}>
                <TextInput disabled source="id" fullWidth={true}/>
                {PublicationInputs()}
                <CustomReferenceArrayInput source='projects' order={{field: 'title', order: 'DESC'}}>
                    <CustomSelectArrayInput reference='project_ids' name='Associated Projects'
                                            setValues={(values, record) => values.filter(e => e.publications.filter(ee => ee.publication_id == record['id']).length > 0).map(e => e.id)}
                    />
                </CustomReferenceArrayInput>
                <CustomReferenceArrayInput source='project_publication_association'
                                           filter={{publication_id: 'record.id'}}>
                </CustomReferenceArrayInput>
            </SimpleForm>
        </Edit>
    );
}

export const PublicationList = (props) => (
    <List filters={<PublicationFilter/>} pagination={<Pagination rowsPerPageOptions={[10, 25, 50, 100]}/>} {...props} bulkActionButtons={<PublicationBulkEdit/>}>
        <Datagrid rowClick="show">
            {PublicationListFields({className: 'limited-textfield'})}
            <EditButton/>
        </Datagrid>
    </List>
);


export const PublicationShow = ({...props}) => (
    <Show title="Publication Show" {...props} actions={<PublicationShowToolbar {...props}/>}>
        <SimpleShowLayout>
            {PublicationFields()}
        </SimpleShowLayout>
    </Show>
);

export const PublicationResource = () => {
    return <Resource
        name="publications"
        list={PublicationList}
        edit={PublicationEdit}
        show={PublicationShow}
        create={PublicationCreate}
    />
};



