import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ToggleButton from '@material-ui/lab/ToggleButton';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { myDataProvider } from '../../utils';
import ns_postalcode from '../../utils/ns_postal_small.json';
import ns_functional from '../../utils/ns_functional_small.json';
import makeStyles from '@material-ui/core/styles/makeStyles';


export const capitalizeFirstLetter = (string) => string[0].toUpperCase() + string.slice(1);

export const geomap = {
    0: { geojson: ns_postalcode, featureidkey: 'properties.CFSAUID', nsquality_column: 'location_postal' },
    1: { geojson: ns_functional, featureidkey: 'properties.id', nsquality_column: 'location_region' },
};

const useStyles = makeStyles((theme) => ({
    formControlTop: { margin: theme.spacing(0.2), marginTop: theme.spacing(1), marginBottom: theme.spacing(0.5) },
    formControlMid: { margin: theme.spacing(0.2), marginTop: theme.spacing(0.5), marginBottom: theme.spacing(0.5) },
    formControlBottom: { margin: theme.spacing(0.2), marginTop: theme.spacing(0.5), marginBottom: theme.spacing(1) },
}));

export const SimpleDataSelector = ({
    onUpdate = (data, metadata) => {},
    style = {},
    geoSelection=1,
    plotlymode=true,
}) => {
    const classes = useStyles();

    const history = useHistory();
    const [nsQuality, setNSQuality] = useState({ state: null });
    const [selectedColumn, setSelectedColumn] = useState('VOLUNTEER');
    const [mathSelection, setMathSelection] = useState('mean');
    const [splitSelection, setSplitSelection] = useState('all');
    const [weighted, setWeighted] = useState(true);
    const provider = myDataProvider();

    const [metadata, setMetadata] = useState({ state: null });
    const [selectedMetadata, setSelectedMetadata] = useState({ state: null });
    const [functionalNames, setFunctionalNames] = useState({ state: null });

    useEffect(() => {
        provider.get('/metadata', { range: [0, 1], filter: { index: 'REGION' } })
            .then(data => setFunctionalNames(data)).catch(redirectError);
        provider.get('/metadata', { fields: ['index'], range: [0, 10000] })
            .then(data => setMetadata(data)).catch(redirectError);
    }, []);

    useEffect(() => {
        setSplitSelection('all');
        provider.get('/metadata', { range: [0, 1], filter: { index: selectedColumn } })
            .then(data => {
                setSelectedMetadata(data);
            }).catch(redirectError);
    }, [selectedColumn]);

    // Fetch index data
    useEffect(() => {
        provider.post('/nsquality_map',
            {
                body: {
                    index_field: geomap[geoSelection].nsquality_column,
                    weighted: weighted,
                    map_fields: [{
                        name: selectedColumn,
                        label: 'value',
                        operation: mathSelection,
                        filter: (splitSelection === 'all' ? null : splitSelection)
                    }],
                }
            })
            .then(setNSQuality).catch(redirectError);
    }, [geoSelection, weighted, selectedColumn, mathSelection, splitSelection]);


    // Emit output signal
    useEffect(() => {
        if (nsQuality.status === 'FETCHED') {
            let data = nsQuality.data.data;
            if(plotlymode){
                data = { z: [], locations: [], customdata: null };
                const nsQualityData = nsQuality.data.data;
                data.locations = Object.keys(nsQualityData);
                data.z = Object.keys(nsQualityData).map(e => nsQualityData[e][0]['value']);

                if (functionalNames.status === 'FETCHED') {
                    let _functionalNames = {};
                    for (let i = 1; i <= 10; i++) {
                        _functionalNames[i] = functionalNames.data[0]['map_' + i];
                    }
                    data.customdata = Object.keys(nsQualityData).map(e => ([_functionalNames[parseInt(e)] || e]));
                }
            }

            onUpdate(data, {geoSelection, mathSelection, splitSelection, weighted, selectedMetadata});
        }
    }, [nsQuality, functionalNames]);

    const handleValueClick = (e, value) => {
        if (value !== null) setSelectedColumn(value.index);
    };

    const redirectError = (e) => {
        if (e.message === 'FORBIDDEN') history.push('/forbidden');
        else history.push('/login');
    };

    return (
        <Card style={style}>
            <CardContent>
                <FormControl>
                    {metadata.status === 'FETCHED' &&
                    <Autocomplete
                        value={{ index: selectedColumn }}
                        id="combo-box-demo"
                        options={metadata.data}
                        getOptionLabel={(option) => option.index}
                        onChange={handleValueClick}
                        renderInput={(params) =>
                            <TextField {...params} label="Question being shown" variant="outlined"/>}
                    />}
                    {selectedMetadata.status === 'FETCHED' &&
                    <Card style={{
                        color: 'black', fontSize: '0.4em', textAlign: 'left',
                        backgroundColor: 'rgb(241,241,241)',
                        borderRadius: '0.1em', stroke: 'black', strokeWidth: '1em'
                    }}>
                        {/*<div>{selectedMetadata.data[0].continuous.toString()}</div>*/}
                        <CardContent>
                            <Typography>Details of {selectedColumn}:</Typography>
                            <div>{selectedMetadata.data[0].heading}</div>
                            <div>{selectedMetadata.data[0].subheading}</div>
                            <div>{selectedMetadata.data[0].description}</div>
                        </CardContent>
                        {/*<div>{selectedMetadata.data[0].index}</div>*/}
                    </Card>
                    }
                    <FormControl variant="filled" className={classes.formControlTop}>
                        <InputLabel>Math Operation</InputLabel>
                        <Select
                            value={mathSelection}
                            onChange={(event) => setMathSelection(event.target.value)}
                        >
                            <MenuItem value={'max'}>Max</MenuItem>
                            <MenuItem value={'min'}>Min</MenuItem>
                            <MenuItem value={'sum'}>Sum</MenuItem>
                            <MenuItem value={'mean'}>Mean</MenuItem>
                            <MenuItem value={'count'}>Count</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" className={classes.formControlBottom}>
                        <InputLabel id="demo-simple-select-filled-label">View Question Value</InputLabel>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={splitSelection}
                            onChange={(event) => setSplitSelection(event.target.value)}
                        >
                            <MenuItem value={'all'} key={'all'}>All</MenuItem>
                            {selectedMetadata.status === 'FETCHED' && !selectedMetadata.data[0].continuous &&
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 99].map(v => {
                                if ('map_' + v in selectedMetadata.data[0])
                                    return (
                                        <MenuItem value={v}
                                                  key={v}>
                                            {capitalizeFirstLetter(selectedMetadata.data[0]['map_' + v])}
                                        </MenuItem>
                                    );
                                return <span/>;
                            })
                            }
                        </Select>
                    </FormControl>
                    <ToggleButton value="check" selected={weighted} onChange={() => setWeighted(!weighted)}>Weighted</ToggleButton>
                </FormControl>
            </CardContent>
        </Card>
    );
};