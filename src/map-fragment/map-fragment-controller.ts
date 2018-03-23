import { MapFragmentTile } from './map-fragment-tile';
import { Selection, BaseType, select, event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { MapTile } from './map-tile';

export class MapFragmentController {
    private d3Root: Selection<HTMLElement, any, any, any>;
    private svg: Selection<BaseType, any, any, any>;
    private mapTileWidth: number;
    private mapTileHeight: number;
    private hexSize = 20;
    private hexAmountHorizontal = 5;
    private hexAmountVertical = 5;
    private width = 0;
    private height = 0;

    constructor(private container: HTMLElement) {
        this.d3Root = select(this.container);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        const hexWidth = this.computeHexWidth(this.hexSize);
        const hexHeight = this.hexSize * 2;

        this.mapTileWidth = hexWidth * this.hexAmountHorizontal;
        this.mapTileHeight = hexHeight * this.hexAmountVertical * 0.75;

        //todo: remove
        this.mapTileHeight += 10;
        this.mapTileWidth += 1;
        //todo /remove

        const zoomDef = zoom()
            .scaleExtent([1, 1])
            .on('zoom', () => {
                let visibleTiles: MapFragmentTile[] = [];
                let invisibleTiles: MapFragmentTile[] = [];

                this.svg.selectAll('g')
                    .filter((d: MapFragmentTile) => this.filterPosition(d, event.transform))
                    .each((d: MapFragmentTile) => visibleTiles.push(d));

                this.svg.selectAll('g')
                    .filter((d: MapFragmentTile) => !this.filterPosition(d, event.transform))
                    .each((d: MapFragmentTile) => invisibleTiles.push(d));

                visibleTiles = this.generateMapTiles(visibleTiles);

                this.render(visibleTiles);

                invisibleTiles.forEach(tile => tile.destroy());
            });

        this.svg = this.d3Root.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .call(zoomDef);

        this.render(this.generateMapTiles([]));
    }

    computeHexWidth(hexSize: number) {
        return Math.sqrt(3) / 2 * hexSize * 2;
    }

    private render(fragments: MapFragmentTile[] = []) {
        const tiles = this.svg.selectAll('g')
            .data(fragments);

        tiles.exit()
            .each((d: MapFragmentTile) => d.destroy())
            .remove();

        tiles.merge(tiles)
            .each(function (d) {
                d.init(this);
            })
            .attr('transform', this.computeTranslate);

        tiles.enter()
            .append('g')
            .attr('transform', this.computeTranslate)
            .each(function (d) {
                d.init(this);
            });
    }

    private computeTranslate = (tile: MapFragmentTile) => {
        const transform = event ? { ...event.transform } : { x: 0, y: 0 };

        if (tile.y % 2 === 0) {
            transform.x += this.computeHexWidth(this.hexSize) / 2;
        }

        return `translate(${tile.x * this.mapTileWidth + transform.x}, ${tile.y * this.mapTileHeight + transform.y})`;
    }

    private filterPosition(tile: MapFragmentTile, transform: { x: number, y: number }) {
        if (tile.x * this.mapTileWidth + transform.x + this.mapTileWidth < 0) {
            return false;
        }

        if (tile.y * this.mapTileHeight + transform.y + this.mapTileHeight < 0) {
            return false;
        }

        if (tile.x * this.mapTileWidth + transform.x > this.width) {
            return false;
        }

        if (tile.y * this.mapTileHeight + transform.y > this.height) {
            return false;
        }

        return true;
    }

    private generateMapTiles(tiles: MapFragmentTile[]): MapFragmentTile[] {
        const amountHorizontal = Math.ceil(this.width / this.mapTileWidth) + 1;
        const amountVertical = Math.ceil(this.height / this.mapTileHeight) + 1;

        tiles = [...tiles];

        const transform = event ? event.transform : { x: 0, y: 0 };

        const topLeft = {
            x: -Math.ceil(transform.x / this.mapTileWidth),
            y: -Math.ceil(transform.y / this.mapTileHeight)
        }

        for (let x = topLeft.x; x < amountHorizontal + topLeft.x; ++x) {
            for (let y = topLeft.y; y < amountVertical + topLeft.y; ++y) {
                const existing = tiles.filter(tile => tile.x === x && tile.y === y);

                if (!existing.length) {
                    tiles.push(new MapFragmentTile({ x, y }, this.mapTileWidth, this.mapTileHeight,
                        this.hexSize, this.hexAmountHorizontal, this.hexAmountVertical
                    ));
                }
            }
        }

        return tiles;
    }
}
