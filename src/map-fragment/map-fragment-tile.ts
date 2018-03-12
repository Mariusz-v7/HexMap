import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3'

import { Selection, BaseType } from 'd3-selection';
import { MapTile } from './map-tile';

export class MapFragmentTile {
    private d3Root: Selection<BaseType, any, any, any>;
    private container: BaseType;
    private bound = false;
    private destroyed = false;

    constructor(private mapTile: MapTile, private tileSize: number) {
        console.log('tile created', mapTile)
    }

    get x() {
        return this.mapTile.x;
    }

    get y() {
        return this.mapTile.y;
    }

    get isBound() {
        return this.bound;
    }

    init(container: BaseType) {
        this.bound = true;
        console.log('tile init', this.mapTile)

        this.container = container;

        this.d3Root = select(this.container);

        this.render();
    }

    render() {
        this.d3Root.selectAll('*').remove(); // todo: maybe replace....

        this.d3Root.append('rect')
            .attr('x', 1)
            .attr('y', 1)
            .attr('width', this.tileSize)
            .attr('height', this.tileSize)


        this.d3Root.append('text')
            .attr('x', 10)
            .attr('y', 30)
            .style('fill', 'white')
            .text(`${this.x} x ${this.y}`);
    }

    destroy() {
        if (this.destroyed) {
            console.error('Tile already destroyed', this);
            return;
        }

        this.destroyed = true;

        console.info('tile destroyed', this.mapTile)
    }

}
