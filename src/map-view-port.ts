import { select, Selection, BaseType } from 'd3-selection';
import { geoPath, geoProjection, GeoStream, GeoStreamWrapper } from 'd3-geo';
import { feature } from 'topojson';
import { Feature } from 'geojson';
import { HexProjection } from './hex-projection';
import { Topology } from './topology';

export class MapViewPort extends HTMLElement {
    private shadow: ShadowRoot;
    private container: HTMLElement;
    private d3root: Selection<BaseType, any, any, any>;
    private width = 0;
    private height = 0;
    private streamWrapper = new HexProjection();

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
        const topology = new Topology();

        const path = geoPath(this.streamWrapper);

        this.d3root.append('g')
            .selectAll('path')
            .data(topology.objects.tiles.geometries)
            .enter()
            .append('path')
            .attr('d', d => {

                const conversion: any = feature(topology, d);

                const geoJsonFeature: Feature<any, any> = {
                    geometry: conversion.geometry,
                    properties: conversion.properties,
                    type: 'Feature'
                };

                return path(geoJsonFeature, d);
            });

    }

}

customElements.define('map-view-port', MapViewPort); 
