import React from 'react';
import { useMap } from 'react-leaflet';

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
};

export const LeafletControl = ({ children, position, style = {}, onMouseEnter = () => {}, onMouseLeave = () => {}, }) => {
    const map = useMap();
    return <div className={POSITION_CLASSES[position]}
                style={style}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}>
        <div className="leaflet-control"
             style={style}>
            {/*<div className="leaflet-control leaflet-bar">*/}
            {children}
        </div>
    </div>;
};