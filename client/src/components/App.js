import React from 'react';
import { Header } from 'semantic-ui-react';
import MainView from './MainView';
import styles from './App.style';
import TopMenu from './TopMenu';
import Footer from './Footer';

const App = () => (
  <div style={styles.siteStyle}>
    <TopMenu />

    <div style={styles.siteContentStyle}>
      <Header
        as="h2"
        color="teal"
        textAlign="center"
        content="Client Generating Coins"
      />
      <MainView />
    </div>

    <Footer />
  </div>
);

export default App;
