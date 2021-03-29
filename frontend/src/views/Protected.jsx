import React from 'react';
import { myDataProvider } from '../utils';

export const Protected = () => {
    const provider = myDataProvider();
    const {status, data, loading, error} = provider.get('/metadata', {index:'PC1'});
    console.log('aa', status, data, loading, error);

    return <h1>This component is protected</h1>;
};
