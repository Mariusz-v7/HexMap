import { MapFragmentTile } from './map-fragment-tile';
import { Selection, BaseType, select } from 'd3-selection';

export class MapFragmentController {
    private d3Root: Selection<HTMLElement, any, any, any>;

    constructor(private container: HTMLElement) {
        this.d3Root = select(this.container);
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // todo: compute amount of tiles and their location
        // todo: load and unload tiles dynamically when user drags the map
    }
}
