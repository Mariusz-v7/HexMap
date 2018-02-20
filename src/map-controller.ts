import { select, Selection, BaseType } from 'd3-selection';
import { event } from 'd3';
import { Topology } from './topology';
import { Renderer } from './renderer';
import { zoom } from 'd3-zoom';

/**
 * This is not related to MVC controller... ;)
 */
export class MapController {
    constructor(private mapContainer: Selection<BaseType, any, any, any>,
        private topology: Topology, private renderer: Renderer,
        private width: number, private height: number) {

        const zoomDef = zoom()
            .scaleExtent([0, 0])
            .translateExtent([[0, 0], [this.width, this.height]]) // todo: this does not work
            .on('zoom', () => this.onZoom());

        this.mapContainer.call(zoomDef);
    }

    private onZoom() {
        this.mapContainer.attr('transform', this.getEvent().transform);
    }

    private getEvent() {
        return event;
    }
}
