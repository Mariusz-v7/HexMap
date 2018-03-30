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

        const zoomDef = zoom()
            .scaleExtent([1, 1])
            .on('zoom', () => {
                const visibleTiles: MapFragmentTile[] = [];
                const invisibleTiles: MapFragmentTile[] = [];
                const allTiles: MapFragmentTile[] = [];

                this.svg.selectAll('g')
                    .each((d: MapFragmentTile) => {
                        allTiles.push(d);

                        if (this.filterPosition(d, event.transform)) {
                            visibleTiles.push(d);
                        } else {
                            invisibleTiles.push(d);
                        }
                    });

                const newTileSet = this.generateMapTiles(allTiles, visibleTiles, invisibleTiles);

                this.render(newTileSet);

                invisibleTiles.forEach(tile => tile.destroy());
            });

        this.svg = this.d3Root.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .call(zoomDef);

        this.render(this.generateMapTiles());
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

        if (this.hexAmountVertical % 2 === 1 && tile.y % 2 === 0) {
            transform.x += this.computeHexWidth(this.hexSize) / 2;
        }

        return `translate(${tile.x * this.mapTileWidth + transform.x}, ${tile.y * this.mapTileHeight + transform.y})`;
    }

    private filterPosition(tile: MapFragmentTile, transform: { x: number, y: number }) {
        if (tile.x * this.mapTileWidth + transform.x + this.mapTileWidth < -1) {
            return false;
        }

        if (tile.y * this.mapTileHeight + transform.y + this.mapTileHeight < -1) {
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

    private generateMapTiles(
        allTiles: MapFragmentTile[] = [],
        visibleTiles: MapFragmentTile[] = [],
        invisibleTiles: MapFragmentTile[] = []
    ): MapFragmentTile[] {
        const amountHorizontal = Math.ceil(this.width / this.mapTileWidth) + 2;
        const amountVertical = Math.ceil(this.height / this.mapTileHeight) + 2;

        const newTileSet: MapFragmentTile[] = [];

        const transform = event ? event.transform : { x: 0, y: 0 };

        const topLeft = {
            x: -Math.ceil(transform.x / this.mapTileWidth) - 1,
            y: -Math.ceil(transform.y / this.mapTileHeight) - 1
        }

        for (let x = topLeft.x; x < amountHorizontal + topLeft.x; ++x) {
            for (let y = topLeft.y; y < amountVertical + topLeft.y; ++y) {
                newTileSet.push(
                    new MapFragmentTile(
                        { x, y }, this.mapTileWidth, this.mapTileHeight,
                        this.hexSize, this.hexAmountHorizontal, this.hexAmountVertical
                    )
                );
            }
        }

        invisibleTiles = [...invisibleTiles];
        const resulting: MapFragmentTile[] = new Array(newTileSet.length);

        newTileSet.forEach(tile => {
            const existing = visibleTiles
                .find(checking => checking.x === tile.x && checking.y === tile.y);

            if (existing) {
                const existingIndex = allTiles
                    .findIndex(checking => checking.x === existing.x && checking.y === existing.y)

                resulting[existingIndex] = existing;
            } else {
                if (invisibleTiles.length > 0) {
                    const invisible = invisibleTiles.shift();
                    const invisibleIndex = allTiles
                        .findIndex(checking => checking.x === invisible.x && checking.y === invisible.y);

                    resulting[invisibleIndex] = tile;
                } else {
                    const emptySlotIndex = resulting.findIndex(x => x === undefined);
                    resulting[emptySlotIndex] = tile;
                }
            }
        });

        return resulting;
    }
}
