import Plot from 'react-plotly.js';
import React, { useEffect, useState } from 'react';
import ns_postalcode from '../utils/ns_postal_small.json';

export const PlotlyMap = ({
    title = 'asd',
    geojson = ns_postalcode,
    featureidkey = 'properties.CFSAUID',
    data,
    hovertemplate = '',
    opacity = 1.0,
    style={},
}) => {
    const [mapData, setMapData] = useState({
        // type: 'scattermapbox',
        type: 'choroplethmapbox',
        locations: [],
        z: [],
        // marker: { color: 'fuchsia', size: 4 },
        colorscale: 'Viridis',
    });

    useEffect(() => {
        // console.log(featureidkey, data);
        setMapData({ ...mapData,
            locations: data.locations,
            z: data.z,
            customdata: data.customdata,
            featureidkey: featureidkey,
            hovertemplate: hovertemplate,
            colorbar: {
                x: 1,
                y: 0.5,
                xanchor: 'right',
                title: {text: title},
                len: 0.6,
                thickness: 8,
                bgcolor: 'rgba(0,0,0,0)',
                bordercolor: '#000000',
                borderwidth: 0,
                outlinecolor: 'rgb(68,68,68)',
                outlinewidth: 1,
            },
            marker: {opacity: opacity},
            geojson: geojson});
    }, [data, geojson, featureidkey, hovertemplate]);

    const handleValueClick = (e, value) => {
        setValue(value.index);
    };

    return <Plot
        style={{ width: '100vw', height: '100vh', ...style }}
        data={[mapData]}
        layout={{
            dragmode: 'zoom',
            margin: { r: 0, t: 0, b: 0, l: 0 },
            showlegend: true,
            legend: {
                x: 0,
                y: 1,
                // xanchor: 'right',
                // bordercolor: '#000000',
                // borderwidth: 0
            },
            mapbox: {
                style: 'open-street-map',
                center: { lat: 45.2, lon: -63.16 },
                zoom: 7,
                // layers: [{
                //     source: ns_postalcode,
                //     type: 'fill',
                // }]
            },
        }}
        config={{ responsive: true }}
    />;
};
