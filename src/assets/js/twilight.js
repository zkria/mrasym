/**
 * Salla backend will take care about twilight injecting into your theme pages.
 * This file just for IDE purpose, and it shouldn't be in webpack bundle output.
 *
 * 🚨 Including this file in your bundle could cause unexpected issues.
 *
 * If you are using webpack, make sure to add it to the exclude rules in webpack.config.js:
 *
 * {
 *     test: /\.js$/,
 *     exclude: [
 *         // other exclusions
 *         path.resolve(__dirname, 'src/assets/js/twilight.js')
 *     ]
 * };
 */

import { applyPolyfills, defineCustomElements as SallaWebComponents } from '@salla.sa/twilight-components/loader';

applyPolyfills().then(() => {
    SallaWebComponents(window);
});