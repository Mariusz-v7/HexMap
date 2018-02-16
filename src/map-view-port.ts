import { select, Selection, BaseType } from 'd3-selection';
import { Topology } from './topology';
import { Renderer } from './renderer';

export class MapViewPort extends HTMLElement {
    private shadow: ShadowRoot;
    private container: HTMLElement;
    private d3root: Selection<BaseType, any, any, any>;
    private width = 0;
    private height = 0;
    private renderer: Renderer;

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

        this.renderer = new Renderer(this.d3root, new Topology());
        this.renderer.render();
    }

}

customElements.define('map-view-port', MapViewPort); 
