import { select, Selection, BaseType } from 'd3-selection';

export class MapViewPort extends HTMLElement {
    private shadow: ShadowRoot;
    private container: HTMLElement;
    private d3root: Selection<BaseType, any, any, any>;
    private width = 0;
    private height = 0;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');

        this.shadow.appendChild(this.container);
    }

    private connectedCallback() {
        this.height = parseInt(this.getAttribute('height') || '0', 10);
        this.width = parseInt(this.getAttribute('width') || '0', 10);

        this.d3root = select(this.container).append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.render();
    }

    private render() {

        this.d3root.append('circle')
            .attr('cx', 30)
            .attr('cy', 30)
            .attr('r', 10);

    }

}

customElements.define('map-view-port', MapViewPort); 
