import React, { useEffect, useRef, useState } from 'react';
import { useMapEvent, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import Button from '@material-ui/core/Button';
import PhotoSizeSelectSmallIcon from '@material-ui/icons/PhotoSizeSelectSmall';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Plotly from 'plotly.js';
import useDeepCompareEffect from 'use-deep-compare-effect';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const unselectedPath = {
    color: 'black',
    weight: 1,
};

const selectedPath = {
    color: '#7f7f7f',
    weight: 10,
};

const popupOptions = {
    className: 'popup-classname'
};

export const pathStyle = {
    ...unselectedPath,
    fillColor: 'white',
    fillOpacity: 0.8,
};

const resetLayer = (map, style) => {
    map.eachLayer(layer => {
        if (layer instanceof L.Path) {
            layer.setStyle(style);
        }
    });
};

export const Lasso = ({
    onActivate = () => {},
    onSelected = (layers) => {},
}) => {
    const [isActive, setActive] = useState(false);

    const handleSelection = (layers = null) => {
        setActive(false);
        if (!!layers) {
            layers.forEach(e => {
                e.setStyle(selectedPath);
            });
            onSelected(layers);
        } else onSelected([]);
    };

    const map = useMapEvent('lasso.finished', (event) => handleSelection(event.layers));
    const lasso = L.lasso(map, { intersect: true, polygon: { className: 'lasso-classname' } });

    useEffect(() => {
        if (isActive) {
            resetLayer(map, unselectedPath);
            onActivate();
            lasso.enable();
        } else {
            lasso.disable();
        }
    }, [isActive]);

    return <div>
        <Button variant={(isActive ? null : 'contained')}
                startIcon={<PhotoSizeSelectSmallIcon/>}
                onClick={(e) => {
                    console.log(isActive);
                    if (isActive) handleSelection();
                    else {
                        setActive(true);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                }}>Lasso Select</Button>
    </div>;
};

export const Opacity = ({ props }) => {
    const [opacity, setOpacity] = useState(1);
    const map = useMapEvents({});

    useEffect(() => {
        resetLayer(map, { fillOpacity: opacity });
    }, [opacity]);

    return <FormControl variant="filled" style={{
        backgroundColor: 'rgba(241,241,241,0.93)',
        padding: '1em 1.5em 1em 1.5em',
        margin: '1em 0 1em 0',
        borderRadius: '0.1em',
    }} {...props}
    >
        <Typography id="discrete-slider" gutterBottom style={{ color: 'black', textAlign: 'left', margin: '0' }}>
            Map Transparency
        </Typography>
        <Slider
            defaultValue={0}
            valueLabelFormat={v => v * 100 + '%'}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            onChange={(e, v) => {
                setOpacity(1 - v);
            }}
            step={0.05}
            min={0}
            max={1}
        />
    </FormControl>;
};

export const PlotlyMapTooltip = ({
    map,
    onMouseEnter = () => {},
    onMouseLeave = () => {},
    data = [{
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        type: 'scatter'
    }],
    layout = {
        autosize: true,
        width: 300,
        height: 150,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        }
    }
}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visibleFeature, setVisibleFeature] = useState(false);
    const [visibleTooltip, setVisibleTooltip] = useState(false);
    const [visibleChart, setVisibleChart] = useState(false);
    const plot = useRef();

    const onFeatureMouseOver = (e) => {
        let pos = map.latLngToContainerPoint(e.target.getCenter());
        setPosition({ x: pos.x - layout.width / 2 - 20, y: pos.y, });
        setVisibleFeature(true);
    };
    const onFeatureMouseLeave = (e) => {
        setVisibleFeature(false);
    };
    const onFeatureClick = (e) => {};

    useEffect(() => {
        map.eachLayer(l => {
            if (l instanceof L.Path) {
                l.on({
                    mouseover: onFeatureMouseOver,
                    mouseout: onFeatureMouseLeave,
                    // click: onFeatureClick
                });
            }
        });

        Plotly.newPlot('map-tooltip', data, layout);
        plot.current.on('plotly_hover', () => setVisibleChart(true));
        plot.current.on('plotly_unhover', () => setVisibleChart(false));
    }, [map]);

    useDeepCompareEffect(() => {
        Plotly.animate('map-tooltip', {
            data: data,
            traces: [0],
            layout: layout
        }, {
            transition: {
                duration: 500,
                easing: 'cubic-in-out'
            },
            frame: {
                duration: 500
            }
        });
    }, [data]);

    return (
        <Card
            onMouseEnter={() => {setVisibleTooltip(true);}}
            onMouseLeave={() => {
                console.log('leave');
                setVisibleTooltip(false);
            }}
            className={'leaflet-control plotly-tooltip'}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                display: (visibleFeature || visibleTooltip || visibleChart ? '' : 'none'),
                backgroundColor: 'rgb(241,241,241)',
                padding: '0.3em 0.3em 0.3em 0.3em',
                borderRadius: '0.1em',
                paddingTop: '5px',
            }}>
            <CardContent>
                <div id='map-tooltip'
                     ref={plot}
                     onMouseEnter={onMouseEnter}
                     onMouseLeave={onMouseLeave}>
                </div>
            </CardContent>
        </Card>
    );
};

export const PlotlyGraph = ({
    id,
    data = [{
        x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        type: 'scatter'
    }],
    layout = {},
    config = {},
    ...props
}) => {
    const plot = useRef();
    const _layout = {
        title: 'Graph1',
        autosize: true,
        // width: 200,
        height: 200,
        xaxis: {fixedrange: true},
        yaxis: {fixedrange: true},
        margin: {
            l: 20,
            r: 20,
            b: 30,
            t: 40,
            // pad: 10
        },
        ...layout
    };
    const _config = {
        displayModeBar: false,
        displaylogo: false,
        ...config,
    }

    useEffect(() => {
        if (!!plot && !!plot.current) {
            Plotly.newPlot(id, data, _layout, _config);
            // plot.current.on('plotly_hover', () => setVisibleChart(true));
            // plot.current.on('plotly_unhover', () => setVisibleChart(false));
        }
    }, []);

    return <div id={id}
                ref={plot}
        // onMouseEnter={onMouseEnter}
        // onMouseLeave={onMouseLeave}
    >
    </div>;
};

