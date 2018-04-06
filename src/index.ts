// import '@webcomponents/custom-elements/src/native-shim.js';
export { MapViewPort } from './map-view-port';

import { enableDebug } from './redux/actions/enable-debug';
import { store } from './redux/store';

store.dispatch(enableDebug());