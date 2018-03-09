import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3'

import { Selection, BaseType } from 'd3-selection';
import { MapTile } from './map-tile';

export class MapFragmentTile {
    private d3Root: Selection<BaseType, any, any, any>;

    constructor(private container: BaseType, private mapTile: MapTile, private tileSize: number) {
        console.log('tile created', mapTile)

        this.d3Root = select(this.container);

        this.d3Root.append('rect')
            .attr('x', 1)
            .attr('y', 1)
            .attr('width', tileSize)
            .attr('height', tileSize)
    }

    destroy() {
        console.info('tile destroyed', this.mapTile)
    }

}
