import React from 'react';
import {Routes} from './Routes';
import { AuthProvider } from './utils';

const App = () => <AuthProvider><Routes/></AuthProvider>;

export default App;
