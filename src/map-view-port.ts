import { select, Selection, BaseType } from 'd3-selection';
import styles from './styles.css';
import { MapFragmentController } from './map-fragment/map-fragment-controller';

export class MapViewPort extends HTMLElement {
    private shadow: ShadowRoot;
    private container: HTMLElement;
    private width = 0;
    private height = 0;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.container.setAttribute('class', 'container');

        const style = document.createElement('style');
        style.textContent = styles;

        this.shadow.appendChild(style);
        this.shadow.appendChild(this.container);
    }

    private connectedCallback() {
        const inputHeight = this.getAttribute('height');
        const inputWidth = this.getAttribute('width');

        if (inputWidth === 'auto') {
            this.width = window.innerWidth;
        } else {
            this.width = parseInt(inputWidth || '0', 10);
        }

        if (inputHeight === 'auto') {
            this.height = window.innerHeight;
        } else {
            this.height = parseInt(inputHeight || '0', 10);
        }

        this.container.setAttribute('style', `
            width: ${this.width}px;
            height: ${this.height}px;
        `);

        const mapFragmentController = new MapFragmentController(this.container);
    }

}

customElements.define('map-view-port', MapViewPort); 
