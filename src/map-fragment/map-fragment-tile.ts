import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3'

import { Selection, BaseType } from 'd3-selection';
import { MapTile } from './map-tile';
import { Topology } from '../hex/topology';
import { Renderer } from '../hex/renderer';

export class MapFragmentTile {
    private d3Root: Selection<BaseType, any, any, any>;
    private container: BaseType;
    private destroyed = false;
    private topology: Topology;
    private renderer: Renderer;

    constructor(private mapTile: MapTile, private mapTileWidth: number, private mapTileHeight: number,
        private hexSize: number, private hexAmountHorizontal: number, private hexAmountVertical: number) {
    }

    get x() {
        return this.mapTile.x;
    }

    get y() {
        return this.mapTile.y;
    }

    init(container: BaseType) {
        this.container = container;
        this.d3Root = select(this.container);

        if (this.renderer) {
            this.renderer.destroy();
        }

        this.topology = new Topology(this.hexAmountHorizontal, this.hexAmountVertical);
        this.renderer = new Renderer(this.d3Root, this.topology, this.hexSize);

        this.renderer.render();
        // this.render();
    }

    private render() { // test purposes
        this.d3Root.selectAll('*').remove(); // todo: maybe replace....

        this.d3Root.append('rect')
            .attr('x', 1)
            .attr('y', 1)
            .attr('width', this.mapTileWidth)
            .attr('height', this.mapTileHeight)


        this.d3Root.append('text')
            .attr('x', 10)
            .attr('y', 30)
            .style('fill', 'white')
            .text(`${this.x} x ${this.y}`);
    }

    destroy() {
        if (this.destroyed) {
            return;
        }

        this.destroyed = true;
    }

}
