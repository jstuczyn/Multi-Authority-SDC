import React, { Component } from 'react';
import {Button, Header} from 'semantic-ui-react'

import CTX from "../lib/Milagro-Crypto-Library/ctx"


import MainDisplay from './MainDisplay'

const divStyle = {
    "marginTop": "50px",
    "textAlign": "center"
};

const servers = [
  "127.0.0.1:3000",
];

const ctx = new CTX("BN254");


const App = () => (
    <div style={divStyle}>
        <Header
            as='h1'
            textAlign="center"
            content="Test Query"
        />

        <MainDisplay
            ctx={ctx}
        />
    </div>
);

export default App;