import React, { createContext, useEffect } from 'react';
import {myDataProvider} from './api';
export const DataContext = createContext({});


export const DataProvider = ({ children }) => {
    const provider = myDataProvider();

    return (
        <DataContext.Provider value={{
        }}>
            {children}
        </DataContext.Provider>
    );
};