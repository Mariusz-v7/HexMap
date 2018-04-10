import { MapFragmentTile } from './map-fragment-tile';
import { Selection, BaseType, select, event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { Coordinate } from '../coordinate';
import { MapFragmentTileGenerator } from './map-fragment-tile.generator';

export class MapFragmentController {
    private d3Root: Selection<HTMLElement, any, any, any>;
    private svg: Selection<BaseType, any, any, any>;
    private mainContainer: Selection<BaseType, any, any, any>;
    private mapTileWidth: number;
    private mapTileHeight: number;
    private hexSize = 20;
    private hexAmountHorizontal = 5;
    private hexAmountVertical = 5;
    private viewPortWidth = 0;
    private viewPortHeight = 0;
    private generator: MapFragmentTileGenerator;
    private backgroundSizeExtension = 1;

    constructor(private container: HTMLElement) {
        this.d3Root = select(this.container);
        this.viewPortWidth = this.container.clientWidth;
        this.viewPortHeight = this.container.clientHeight;

        const hexWidth = this.computeHexWidth(this.hexSize);
        const hexHeight = this.hexSize * 2;

        this.mapTileWidth = hexWidth * this.hexAmountHorizontal;
        this.mapTileHeight = hexHeight * this.hexAmountVertical * 0.75;

        const backgroundSize = {
            width: this.viewPortWidth + this.backgroundSizeExtension * 2 * this.mapTileWidth,
            height: this.viewPortHeight + this.backgroundSizeExtension * 2 * this.mapTileHeight
        };

        this.generator = new MapFragmentTileGenerator(this.mapTileWidth, this.mapTileHeight,
            backgroundSize.width, backgroundSize.height,
            this.hexSize, this.hexAmountHorizontal, this.hexAmountVertical);

        const zoomDef = zoom()
            .scaleExtent([1, 1])
            .on('zoom', () => {
                this.render(this.generator.generate(event.transform));
            });

        this.svg = this.d3Root.append('svg')
            .attr('width', this.viewPortWidth)
            .attr('height', this.viewPortHeight)
            .call(zoomDef);

        this.mainContainer = this.svg.append('g');
        this.mainContainer.attr(
            'transform',
            `translate(-${this.mapTileWidth * this.backgroundSizeExtension}, -${this.mapTileHeight * this.backgroundSizeExtension})`
        );

        this.render(this.generator.generate({ x: 0, y: 0 }));
    }

    computeHexWidth(hexSize: number) {
        return Math.sqrt(3) / 2 * hexSize * 2;
    }

    private render(fragments: MapFragmentTile[] = []) {
        const tiles = this.mainContainer.selectAll('g')
            .data(fragments);

        tiles.each(function (d) {
            if (!d || d.initialized) {
                return;
            }

            d.init(this);
        }).attr('transform', this.computeTranslate);

        tiles.enter()
            .append('g')
            .attr('transform', this.computeTranslate)
            .each(function (d) {
                if (!d || d.initialized) {
                    return;
                }

                d.init(this);
            });
    }

    private computeTranslate = (tile: MapFragmentTile) => {
        if (!tile) {
            return;
        }

        const transform = event ? { ...event.transform } : { x: 0, y: 0 };

        if (this.hexAmountVertical % 2 === 1 && tile.y % 2 === 0) {
            transform.x += this.computeHexWidth(this.hexSize) / 2;
        }

        return `translate(${tile.x * this.mapTileWidth + transform.x}, ${tile.y * this.mapTileHeight + transform.y})`;
    }

}
