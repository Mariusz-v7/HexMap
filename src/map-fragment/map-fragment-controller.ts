import { MapFragmentTile } from './map-fragment-tile';
import { Selection, BaseType, select, event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { MapTile } from './map-tile';

export class MapFragmentController {
    private d3Root: Selection<HTMLElement, any, any, any>;
    private svg: Selection<BaseType, any, any, any>;

    constructor(private container: HTMLElement) {
        this.d3Root = select(this.container);
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        const zoomDef = zoom()
            .scaleExtent([1, 1])
            .on('zoom', () => {
                this.svg.selectAll('g')
                    .attr('transform', (d: MapTile) => `translate(${d.x + event.transform.x}, ${d.y + event.transform.y})`)
            });

        this.svg = this.d3Root.append('svg')
            .attr('width', width)
            .attr('height', height)
            .call(zoomDef);

        this.svg
            .selectAll('g')
            .data(this.generateMapTiles())
            .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .each(function (d) {
                new MapFragmentTile(this, d)
            });

        // todo: compute amount of tiles and their location
        // todo: load and unload tiles dynamically when user drags the map
    }

    private generateMapTiles(): MapTile[] {
        return [
            {
                x: 0,
                y: 0,//width: 99
            },
            {
                x: 100,
                y: 0,
            }
        ];
    }
}
