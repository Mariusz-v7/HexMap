import { select, Selection, BaseType } from 'd3-selection';
import { event } from 'd3';
import { Topology } from './topology';
import { Renderer } from './renderer';
import { zoom } from 'd3-zoom';

export class MapDrag {
    constructor(private mapContainer: Selection<BaseType, any, any, any>,
        private topology: Topology, private renderer: Renderer) {

        const zoomDef = zoom()
            .scaleExtent([1 / 2, 8])
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
