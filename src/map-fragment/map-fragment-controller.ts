import { MapFragmentTile } from './map-fragment-tile';
import { Selection, BaseType, select, event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { MapTile } from './map-tile';

export class MapFragmentController {
    private d3Root: Selection<HTMLElement, any, any, any>;
    private svg: Selection<BaseType, MapTile, any, any>;
    private tileSize = 100;
    private width = 0;
    private height = 0;

    constructor(private container: HTMLElement) {
        this.d3Root = select(this.container);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        const tileSize = this.tileSize;

        const zoomDef = zoom()
            .scaleExtent([1, 1])
            .on('zoom', () => {
                const visibleTiles: MapTile[] = [];
                this.svg.selectAll('g')
                    .attr('transform', this.computeTranslate)
                    .filter((d: MapTile) => this.filterPosition(d, event.transform))
                    .each((d: MapTile) => visibleTiles.push(d));

                // TODO: create missing tiles

                const tiles = this.svg.selectAll('g')
                    .data(visibleTiles);

                tiles.exit()
                    .each((d: MapTile) => d.fragment.destroy())
                    .remove();

                tiles.enter()
                    .append('g')
                    .attr('transform', this.computeTranslate)
                    .each(function (d) {
                        d.fragment = new MapFragmentTile(this, d, tileSize - 1);
                    });
            });

        this.svg = this.d3Root.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .call(zoomDef);

        this.svg
            .selectAll('g')
            .data(this.generateMapTiles())
            .enter()
            .append('g')
            .attr('transform', this.computeTranslate)
            .each(function (d) {
                d.fragment = new MapFragmentTile(this, d, tileSize - 1)
            });
    }

    private computeTranslate = (tile: MapTile) => {
        const transform = event ? event.transform : { x: 0, y: 0 };
        return `translate(${tile.x * this.tileSize + transform.x}, ${tile.y * this.tileSize + transform.y})`;
    }

    private filterPosition(tile: MapTile, transform: { x: number, y: number }) {
        if (tile.x * this.tileSize + transform.x + this.tileSize < 0) {
            return false;
        }

        if (tile.y * this.tileSize + transform.y + this.tileSize < 0) {
            return false;
        }

        if (tile.x * this.tileSize + transform.x > this.width) {
            return false;
        }

        if (tile.y * this.tileSize + transform.y > this.height) {
            return false;
        }

        return true;
    }

    private generateMapTiles(): MapTile[] {
        const amountHorizontal = Math.ceil(this.width / this.tileSize);
        const amountVertical = Math.ceil(this.height / this.tileSize);

        const tiles: MapTile[] = [];

        for (let x = 0; x < amountHorizontal; ++x) {
            for (let y = 0; y < amountVertical; ++y) {
                tiles.push({ x, y });
            }
        }

        return tiles;
    }
}
