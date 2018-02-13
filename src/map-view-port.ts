export class MapViewPort extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });

        const child = document.createElement('p');
        child.textContent = 'Hello custom element!';

        this.shadow.appendChild(child);
    }

}

customElements.define('map-view-port', MapViewPort); 
