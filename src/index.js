 /**
 * Copyright (c) International Business Machines
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { loadTheme } from 'office-ui-fabric-react';

loadTheme({
  palette: {
    themePrimary: '#3e76c0',
    themeLighterAlt: '#f6f9fc',
    themeLighter: '#57A8FD',
    themeLight: '#bcd1ec',
    themeTertiary: '#80a7d9',
    themeSecondary: '#5083c7',
    themeDarkAlt: '#376aac',
    themeDark: '#305b81',
    themeDarker: '#22426b',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#c2c2c2',
    neutralSecondary: '#858585',
    neutralPrimaryAlt: '#4b4b4b',
    neutralPrimary: '#333333',
    neutralDark: '#272727',
    black: '#000000',
    white: '#ffffff',
  }
});

export const ibmBlue = '#3E76C0';           // standard button
export const ibmAltText = '#FFFFFF';        // white text
export const ibmDarkText = '#000203';       // black(ish) text
export const ibmBlueGrey = '#6D7777';       // blue grey canvas
export const ibmCyan = '#BFE6FF';           // cyan 
export const ibmCyanPale = '#F5F8F8';       // pale blue canvas
export const ibmGreyDark = '#3C4646';       // Dark grey canvas
export const ibmNWhite30 = '#f4f4f4';       // IBM neutral-white 30 trying to get close to f5f5f5 for gray100
export const ibmGray30 = '#aeaeae';         // IBM Gray 30 trying to get close to bdbdbd for gray100
export const ibmCGray40 = '#959f9f';        // IBM Cool Gray 40 trying to get close to '#9e9e9e' for grey500;

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();