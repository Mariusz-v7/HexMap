import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3'

import { Selection, BaseType } from 'd3-selection';
import { Coordinate } from '../coordinate';
import { Topology } from '../hex/topology';
import { Renderer } from '../hex/renderer';
import { store } from '../redux/store';

export class MapFragmentTile {
    private d3Root: Selection<BaseType, any, any, any>;
    private container: BaseType;
    private destroyed = false;
    private topology: Topology;
    private renderer: Renderer;
    private _initialized = false;

    constructor(private mapTile: Coordinate, private mapTileWidth: number, private mapTileHeight: number,
        private hexSize: number, private hexAmountHorizontal: number, private hexAmountVertical: number) {
    }

    get x() {
        return this.mapTile.x;
    }

    get y() {
        return this.mapTile.y;
    }

    get initialized() {
        return this._initialized;
    }

    init(container: BaseType) {
        if (this.initialized) {
            throw new Error('Tile is already initialized');
        }

        this._initialized = true;

        this.container = container;
        this.d3Root = select(this.container);

        if (store.getState().debug) {
            this.d3Root.attr('debug-x', this.x);
            this.d3Root.attr('debug-y', this.y);
        }

        if (this.renderer) {
            this.renderer.destroy();
        }

        this.topology = new Topology(this.hexAmountHorizontal, this.hexAmountVertical, this.x, this.y);
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

        this.d3Root.append('text')
            .attr('x', 10)
            .attr('y', 60)
            .style('fill', 'white')
            .text('Last updated:');

        const date = new Date();

        this.d3Root.append('text')
            .attr('x', 10)
            .attr('y', 90)
            .style('fill', 'white')
            .text(
                `${date.getHours().toString().padStart(2, '0')}:` +
                `${date.getMinutes().toString().padStart(2, '0')}:` +
                `${date.getSeconds().toString().padStart(2, '0')}.` +
                `${date.getMilliseconds().toString().padStart(3, '0')}`
            );
    }

    destroy() {
        if (this.destroyed) {
            throw new Error('Tile is already destroyed');
        }

        this.destroyed = true;

        if (this.destroyed) {
            return;
        }

        if (this.renderer) {
            this.renderer.destroy();
        }

        if (this.d3Root) {
            this.d3Root.selectAll('*').remove();
        }
    }

}
