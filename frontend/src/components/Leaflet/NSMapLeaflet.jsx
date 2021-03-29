import React, { useEffect, useState } from 'react';
import { GeoJSON, LayersControl, MapContainer, TileLayer } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet-lasso';
import './NSMapLeaflet.css';
import { LeafletControl } from './LeafletControl';
import { geomap, SimpleDataSelector } from '../Data/SimpleDataSelector';
import { Lasso, Opacity, pathStyle } from './MapSubComponents';
import { DashDrawer, useStylesMapDrawer } from './MapDrawer';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';

function getColor (d, maxv, minv) {
    const p = (d - minv) / (maxv - minv);
    return (
        p > .99 ? '#58031e' :
            p > .88 ? '#800026' :
                p > .77 ? '#BD0026' :
                    p > .66 ? '#E31A1C' :
                        p > .55 ? '#FC4E2A' :
                            p > .44 ? '#FD8D3C' :
                                p > .33 ? '#FEB24C' :
                                    p > .22 ? '#FED976' :
                                        p > .11 ? '#FED976' :
                                            '#fff2bf');
}

export const NSMapLeaflet = ({ style, onAreaSelected = (areas) => {}, children = null }) => {
    const classes = useStylesMapDrawer();
    const [map, setMap] = useState(null);
    const [state, setState] = useState({
        data: {},
        mathSelection: 'mean',
        splitSelection: 'all',
        weighted: true,
        selectedMetadata: { state: null }
    });
    const [tooltipVisibility, setTooltipVisibility] = useState(true);
    const [selectedLayers, setSelectedLayers] = useState([]);
    const [allowDragging, setAllowDragging] = useState({});
    const [openDrawer, setOpenDrawer] = useState(false);

    useEffect(() => {
        if (!map) return;
        const allowDraggingValues = Object.values(allowDragging);
        for (let i = 0; i < allowDraggingValues.length; i++) {
            if (!allowDraggingValues[i]) {
                map.dragging.disable();
                return;
            }
        }
        map.dragging.enable();
    }, [allowDragging]);

    const onEachFeature = (feature, layer) => {
        // let valueMap = Object.assign({}, ...nsQuality.data.map(e => ({ [e['PC1']]: e[value] })));
        // let v = valueMap[feature.properties['CFSAUID']];
        // v = v * 128;

        layer.on({
            click: handleClick,
        });
        //
        // layer.bindTooltip('<div id="foo">asdasd</div>', { ...popupOptions })
        //     .on('tooltipopen', (e) => {
        //         console.log(e);
        //         Plotly.newPlot('foo', [{
        //             x: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        //             y: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        //             type: 'scatter'
        //         }], {
        //             autosize: false,
        //             width: 300,
        //             height: 150,
        //             margin: {
        //                 l: 0,
        //                 r: 0,
        //                 b: 0,
        //                 t: 0,
        //                 pad: 0
        //             }
        //         });
        //     });
        // console.log(v);
        layer.setStyle({
            ...pathStyle
            // fillColor: 'rgba(' + v + ', ' + v + ', 52, 1)',
            // color: 'rgba(' + v + ', ' + v + ', 52, 1)',
            // fillOpacity: 1,
        });
    };

    useEffect(() => {
        if (Object.keys(state.data).length > 0) {
            const values = Object.values(state.data).map(v => v[0].value);
            const maxv = Math.max(...values);
            const minv = Math.min(...values);
            map.eachLayer(layer => {
                if (layer instanceof L.Path) {
                    const v = state.data[layer.feature.properties.CFSAUID][0].value;
                    layer.setStyle({
                        fillColor: getColor(v, maxv, minv),
                    });
                }
            });
        }
    }, [state]);

    const handleClick = (event) => {
        console.log(event);
    };

    return <div style={{ height: '100%', width: '100%' }} className={classes.root}>
        <CssBaseline/>
        <div
            className={clsx(classes.content, {
                [classes.contentShift]: openDrawer,
            })}
        >
            <MapContainer className='content'
                          center={[45.2, -63.16]}
                          zoom={8} // ref={mapRef}
                          animate={true}
                          zoomControl={false}
                          whenCreated={setMap}

                          style={{ ...style, height: '100%', width: '100%', zIndex: 1, }}
            >
                {/*{!!map && tooltipVisibility &&*/}
                {/*<PlotlyMapTooltip map={map}*/}
                {/*                  onMouseEnter={() => setAllowDragging({ ...allowDragging, opacity: false })}*/}
                {/*                  onMouseLeave={() => setAllowDragging({ ...allowDragging, opacity: true })}*/}
                {/*/>}*/}
                <LayersControl position="bottomright">
                    <LayersControl.BaseLayer checked name="DarkMode">
                        <TileLayer
                            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenStreetMap.Mapnik">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <GeoJSON
                    attribution="Nova Scotia Postal Codes"
                    data={geomap[0].geojson}
                    onEachFeature={onEachFeature}
                >
                </GeoJSON>
                {/*{mapRef && mapRef.current &&*/}
                {/*<LeafletD3GeoJsonOverlay*/}
                {/*    {...props}*/}
                {/*    map={mapRef.current}*/}
                {/*}*/}
                <LeafletControl position='topright'
                                onMouseEnter={() => setAllowDragging({ ...allowDragging, topright: false })}
                                onMouseLeave={() => setAllowDragging({ ...allowDragging, topright: true })}
                >
                    <Lasso onActivate={() => {
                        setTooltipVisibility(false);
                        setAllowDragging({ ...allowDragging, lasso: false });
                    }} onSelected={(l) => {
                        setTooltipVisibility(true);
                        setSelectedLayers(l);
                        setAllowDragging({ ...allowDragging, lasso: true });
                    }}/>
                    <Opacity onMouseEnter={() => setAllowDragging({ ...allowDragging, opacity: false })}
                             onMouseLeave={() => setAllowDragging({ ...allowDragging, opacity: true })}/>
                    <div>
                        <Button variant='contained' onClick={() => setOpenDrawer(!openDrawer)}>Drawer</Button>
                    </div>
                </LeafletControl>
                <LeafletControl position='topleft' style={{ width: '15vw' }}
                                onMouseEnter={() => setAllowDragging({ ...allowDragging, topleft: false })}
                                onMouseLeave={() => setAllowDragging({ ...allowDragging, topleft: true })}
                >
                    <SimpleDataSelector geoSelection={0} plotlymode={false} onUpdate={(data, metadata) => {
                        setState({ data: data, ...metadata });
                    }}/>
                </LeafletControl>
                {!!children && children}
            </MapContainer>
        </div>
        <DashDrawer open={openDrawer} onClose={() => setOpenDrawer(false)}/>
    </div>;
};
