import React from "react";
import {DeleteButton, SaveButton, Toolbar, useRefresh} from "react-admin";
import {Loading, useUpdate, useCreate, useDeleteMany} from 'react-admin';
import {makeStyles} from '@material-ui/core/styles';
import {useNotify} from "react-admin";
import {useDelete} from "react-admin";
import {useDataProvider} from "react-admin";


const useStyles = makeStyles({
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

export const CustomToolbar = ({transform=(e)=>e, ...props}) => {
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const refresh = useRefresh();

    const handleSave = (e) => {
        let newEntry = transform(e);

        const record = props.record;
        let toRemove = [];
        if('project_publication_association' in record)
            toRemove = record['project_publication_association'].filter(e => !newEntry['project_ids'].includes(e['project_id']));
        else console.log('NO TOREMOVE');

        let toCreate = []
        if('project_ids' in newEntry)
            toCreate = newEntry['project_ids'].filter(e => !record['project_ids'].includes(e));
        else console.log('NO TOCREATE');

        if (!!toRemove && toRemove.length > 0)
            dataProvider.deleteMany('project_publication_association', {ids: toRemove.map(e => e['id'])})
                .then(v => {
                    notify('Deleted', 'info');
                    refresh();
                }).catch(e => notify(e.message, 'error'));
        if (!!toCreate && toCreate.length > 0)
            toCreate.forEach(e => {
                dataProvider.create('project_publication_association', {
                    data: {
                        'project_id': e,
                        'publication_id': record['id']
                    }
                }).then(v => {
                    notify('Created', 'info');
                    refresh();
                }).catch(e => notify(e.message, 'error'));
            });


        return newEntry;
    };

    return (
        <Toolbar {...props} classes={useStyles()}>
            <SaveButton transform={handleSave}/>
            <DeleteButton undoable={false}/>
        </Toolbar>
    )
};