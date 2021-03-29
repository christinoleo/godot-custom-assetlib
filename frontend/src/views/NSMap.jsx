import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { PlotlyMap } from '../components/PlotlyMap';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { capitalizeFirstLetter, geomap, SimpleDataSelector } from '../components/Data/SimpleDataSelector';

export const NSMap = (props) => {
    const [state, setState] = useState({
        data:{ z: [], locations: [], customdata: null }, mathSelection: 'mean', splitSelection: 'all', weighted: true, selectedMetadata: { state: null }
    });
    const [geoSelection, setGeoSelection] = useState(1);
    const [opacity, setOpacity] = useState(1.0);

    const hoverFirstLine = 'Showing ' + (state.splitSelection === 'all' ? 'all' : '\"' + state.selectedMetadata.data[0]['map_' + state.splitSelection] + '\"') + ' answers<br>';

    return <>
        <PlotlyMap
            title=''
            geojson={geomap[geoSelection].geojson}
            featureidkey={geomap[geoSelection].featureidkey}
            opacity={opacity}
            hovertemplate={hoverFirstLine + (state.weighted ? 'Weighted ' : '') + capitalizeFirstLetter(state.mathSelection) + ': %{z} <extra>%{customdata[0]}</extra>'}
            data={state.data}/>
        <SimpleDataSelector geoSelection={geoSelection} onUpdate={(data, metadata) => {
            setState({ data: data, ...metadata });
        }} style={{
            position: 'absolute', left: '1em', top: '1em', zIndex: 9,
            backgroundColor: 'rgb(241,241,241)',
            padding: '0.3em 0.3em 0.3em 0.3em', borderRadius: '0.1em',
            width: '15vw'
        }}

        />
        <FormGroup style={{
            position: 'absolute', left: '0.5em', bottom: '0.5em', zIndex: 9,
            // padding: '0em 0em 0em 0em', borderRadius: '0.1em'
        }}>
            <FormControl variant="filled" style={{
                backgroundColor: 'rgba(241,241,241,0.93)',
                padding: '0.2em 0.5em 0.2em 0.5em',
                margin: '0.2em 0 0.2em 0',
                borderRadius: '0.1em',
            }}
            >
                {/*<ButtonGroup color="primary" aria-label="outlined primary button group">*/}
                {/*    <Button>One</Button>*/}
                {/*    <Button>Two</Button>*/}
                {/*    <Button>Three</Button>*/}
                {/*</ButtonGroup>*/}
                <Typography id="discrete-slider" gutterBottom style={{ color: 'black', textAlign: 'left', margin: '0' }}>
                    Map Transparency
                </Typography>
                <Slider
                    defaultValue={0}
                    valueLabelFormat={v => v * 100 + '%'}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    onChange={(e, v) => setOpacity(1 - v)}
                    step={0.05}
                    min={0}
                    max={1}
                />
            </FormControl>
            <FormControl style={{
                backgroundColor: 'rgba(241,241,241,0.91)',
            }}>
                <ToggleButtonGroup value={geoSelection} onChange={(event, e) => (e !== null ? setGeoSelection(e) : null)}
                                   color="default" exclusive variant="contained" aria-label="contained default button group">
                    <ToggleButton value={0}>Postal Codes</ToggleButton>
                    <ToggleButton value={1}>Functional Districts</ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
        </FormGroup>
    </>;
};
;
