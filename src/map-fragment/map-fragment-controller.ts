import { MapFragmentTile } from './map-fragment-tile';
import { Selection, BaseType, select, event } from 'd3-selection';
import { zoom } from 'd3-zoom';

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
                this.svg.selectAll('circle')
                    .attr('transform', `translate(${event.transform.x}, ${event.transform.y})`)
                console.log(event.transform)
            });

        this.svg = this.d3Root.append('svg')
            .attr('width', width)
            .attr('height', height)
            .call(zoomDef);

        this.svg
            .selectAll('circle')
            .data([{ x: 25, y: 25, r: 10 }, { x: 50, y: 50, r: 20 }])
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.r)
            ;

        // todo: compute amount of tiles and their location
        // todo: load and unload tiles dynamically when user drags the map
    }
}
