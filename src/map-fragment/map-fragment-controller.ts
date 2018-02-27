import { MapFragmentTile } from './map-fragment-tile';
import { Selection, BaseType } from 'd3-selection';

export class MapFragmentController {
    constructor(private root: Selection<BaseType, any, any, any>) {
        const mft = new MapFragmentTile(root);
    }
}
