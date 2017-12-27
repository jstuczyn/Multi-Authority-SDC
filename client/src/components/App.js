import React from 'react';
import {Header} from 'semantic-ui-react';
import MainView from './MainView';
import styles from './App.style';

const App = () => (
    <div style={styles.divStyle}>
        <Header
            as="h1"
            textAlign="center"
            content="Client Generating Coins"
        />
        <MainView/>
    </div>
);

export default App;

// todo: proptypes
