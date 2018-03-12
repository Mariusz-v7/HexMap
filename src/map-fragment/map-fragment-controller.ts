import { MapFragmentTile } from './map-fragment-tile';
import { Selection, BaseType, select, event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { MapTile } from './map-tile';

export class MapFragmentController {
    private d3Root: Selection<HTMLElement, any, any, any>;
    private svg: Selection<BaseType, any, any, any>;
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
                let visibleTiles: MapFragmentTile[] = [];
                let invisibleTiles: MapFragmentTile[] = [];

                this.svg.selectAll('g')
                    .attr('transform', this.computeTranslate)
                    .filter((d: MapFragmentTile) => this.filterPosition(d, event.transform))
                    .each((d: MapFragmentTile) => visibleTiles.push(d));

                this.svg.selectAll('g')
                    .attr('transform', this.computeTranslate)
                    .filter((d: MapFragmentTile) => !this.filterPosition(d, event.transform))
                    .each((d: MapFragmentTile) => invisibleTiles.push(d));

                visibleTiles = this.generateMapTiles(visibleTiles);

                const tiles = this.svg.selectAll('g')
                    .data(visibleTiles);

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

                invisibleTiles.forEach(tile => tile.destroy());
            });

        this.svg = this.d3Root.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .call(zoomDef);

        this.svg
            .selectAll('g')
            .data(this.generateMapTiles([]))
            .enter()
            .append('g')
            .attr('transform', this.computeTranslate)
            .each(function (d) {
                d.init(this);
            });
    }

    private computeTranslate = (tile: MapFragmentTile) => {
        const transform = event ? event.transform : { x: 0, y: 0 };
        return `translate(${tile.x * this.tileSize + transform.x}, ${tile.y * this.tileSize + transform.y})`;
    }

    private filterPosition(tile: MapFragmentTile, transform: { x: number, y: number }) {
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

    private generateMapTiles(tiles: MapFragmentTile[]): MapFragmentTile[] {
        const amountHorizontal = Math.ceil(this.width / this.tileSize) + 1;
        const amountVertical = Math.ceil(this.height / this.tileSize) + 1;

        tiles = [...tiles];

        let lowestX: number = undefined;
        let lowestY: number = undefined;

        tiles.forEach(tile => {
            if (lowestX === undefined) {
                lowestX = tile.x;
            } else {
                lowestX = lowestX < tile.x ? lowestX : tile.x;
            }

            if (lowestY === undefined) {
                lowestY = tile.y;
            } else {
                lowestY = lowestY < tile.y ? lowestY : tile.y;
            }

        });

        if (lowestX === undefined) {
            lowestX = 0;
        }

        if (lowestY === undefined) {
            lowestY = 0;
        }

        for (let x = lowestX; x < amountHorizontal + lowestX; ++x) {
            for (let y = lowestY; y < amountVertical + lowestY; ++y) {
                const existing = tiles.filter(tile => tile.x === x && tile.y === y);

                if (!existing.length) {
                    tiles.push(new MapFragmentTile({ x, y }, this.tileSize - 1));
                }
            }
        }

        return tiles;
    }
}
