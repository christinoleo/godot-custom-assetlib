import React, { useEffect, useState } from 'react';
import { NSMapLeaflet } from '../components/Leaflet/NSMapLeaflet';

export const NSDashboard = (props) => {
    const [selection, setSelection] = useState(null);

    return (
        <div style={{ height: '100vh', width: '100vw', }}>
            <NSMapLeaflet onAreaSelected={(a) => setSelection(a)}/>
        </div>
    );
};