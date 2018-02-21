import { select, Selection, BaseType } from 'd3-selection';
import { Topology } from './topology';
import { Renderer } from './renderer';
import { MapController } from './map-controller';
import styles from './styles.css';
import { MapFragmentController } from './map-fragment/map-fragment-controller';

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

        const style = document.createElement('style');
        style.textContent = styles;

        this.shadow.appendChild(style);
        this.shadow.appendChild(this.container);
    }

    private connectedCallback() {
        this.height = parseInt(this.getAttribute('height') || '0', 10);
        this.width = parseInt(this.getAttribute('width') || '0', 10);

        this.d3root = select(this.container).append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        const mapContainer = this.d3root.append('g');

        const topology = new Topology();

        this.renderer = new Renderer(this.d3root, mapContainer, topology);
        this.renderer.render();

        const mapDrag = new MapController(this.d3root, topology, this.renderer, this.width, this.height);

        //tmp:

        const mapFragmentController = new MapFragmentController();
    }

}

customElements.define('map-view-port', MapViewPort); 
