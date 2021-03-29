import React, {cloneElement, useEffect, useState} from 'react';
import {Loading, useGetList} from 'react-admin';
import {MenuItem as MMenuItem, Select as MSelect} from '@material-ui/core';
import {useField} from 'react-final-form';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export const CustomReferenceArrayInput = ({
                                              record = {},
                                              pagination = {page: 1, perPage: 100},
                                              filter = {},
                                              order = {field: 'title', order: 'DESC'},
                                              loading = <CircularProgress/>,
                                              error = <p>ERROR</p>,
                                              children,
                                              source, ...props
                                          }) => {
    let _filter = Object.fromEntries(Object.entries(filter).map((entry) => {
        if (!!record && entry[0].includes('record.')) {
            entry[0] = record[entry[0].replace('record.', '')];
        }
        if (!!record && entry[1].includes('record.')) {
            entry[1] = record[entry[1].replace('record.', '')];
        }
        return entry;
    }));

    const {data, ids, loading: getListLoading, error: getListError} = useGetList(source, pagination, order, _filter);

    if (getListLoading) {
        if (!children) return <div/>
        return loading;
    }
    if (getListError) {
        if (!children) return <div/>
        return error;
    }
    if (!data) return error;

    const values = Object.values(data);
    record[source] = values;

    if (!children) return <div/>

    return cloneElement(children, {values: values, record: record, ...props});
}

export const CustomSelectArrayInput = ({
                                           values = [],
                                           record = {},
                                           setValues,
                                           reference,
                                           multiple = true,
                                           variant = "filled",
                                           fullWidth = true,
                                           name = '',
                                           ...props
                                       }) => {
    const {
        input: {onChange},
        meta: {touched, error}
    } = useField(reference);
    const classes = useStyles();


    const [selected, setSelected] = useState([]);
    useEffect(() => {
        const v = setValues(values, record);
        setSelected(v);
        onChange(v);
        record[reference] = v;
        // console.log(setValues(values, record), values, record);
    }, [values]);


    const menuItems = values.map(e => <MMenuItem value={e.id} key={e.id}>{e.name}</MMenuItem>)
    return <FormControl variant="filled" className={classes.formControl} fullWidth={fullWidth}>
        <InputLabel>{name}</InputLabel>
        <MSelect
            multiple={multiple}
            variant={variant}
            fullWidth={fullWidth}
            value={selected}
            error={!!(touched && error)}
            onChange={(event) => {
                let v = event.target.value;
                setSelected(v);
                onChange(v);
            }}>
            {menuItems}
        </MSelect>
    </FormControl>
}

