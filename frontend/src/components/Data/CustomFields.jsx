import React, {cloneElement, useEffect, useState} from "react";
import {TextField} from "react-admin";
import {TextInput} from "react-admin";
import {TextField as MTextInput} from "@material-ui/core";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import {makeStyles} from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import startCase from 'lodash/startCase';
import {
    Link as MLink,
} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const LabeledTextField = ({record = {}, value = null, useLabel = true, source, children = null, ...props}) => {
    if (!(source in record) || !record[source] || record[source].length <= 0) return <div/>;
    if (!value) value = record[source];

    let inner = <Typography
        component="span"
        variant="body2">
        {value}
    </Typography>

    if (!!children) {
        inner = children(record, value);
    }

    if (!useLabel)
        return inner

    return <FormControl style={{marginBottom: '0.5em'}}>
        <FormLabel><Typography component="span" variant="caption">{startCase(source)}</Typography></FormLabel>
        {inner}
    </FormControl>

};

export const SimpleLimitedTextField = ({length = 100, record = {}, source, ...props}) => {
    if (!(source in record) || !record[source] || record[source].length <= 0) return <div/>;
    const text = (length > 0 && record[source].length > length ? record[source].substr(0, length) + '...' : record[source]);
    return <LabeledTextField value={text} source={source} record={record} {...props}/>;
};

export const LimitedTextField = ({length = 100, record = {}, source, label, ...props}) => {
    if (!(source in record) || !record[source] || record[source].length <= 0) return <div/>;

    console.log(record[source])
    return <div>
        {record[source]}
    </div>

    return (
        <MTextInput
            label={label}
            multiline
            variant="outlined"
            key={label}
            // style={{paddingBottom: '0.5em'}}
            value={record[source]}
            {...props}/>
    );
};