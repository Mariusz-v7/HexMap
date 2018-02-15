import { select, Selection, BaseType } from 'd3-selection';
import { geoPath, geoProjection, GeoStream, GeoStreamWrapper } from 'd3-geo';
import { feature } from 'topojson';
import { Feature } from 'geojson';

export class MapViewPort extends HTMLElement {
    private shadow: ShadowRoot;
    private container: HTMLElement;
    private d3root: Selection<BaseType, any, any, any>;
    private width = 0;
    private height = 0;
    private streamWrapper: GeoStreamWrapper = {
        stream: this.stream
    };

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
        const topology = {
            transform: {
                scale: [100, 100],
                translate: [50, 50]
            },
            arcs: [
                [[0, 0], [1, 0]],
                [[1, 0], [0, 1]],
                [[1, 1], [-1, 0]],
                [[0, 1], [0, -1]],
            ],
            objects: {
                tiles: {
                    type: 'GeometryCollection',
                    geometries: [
                        {
                            arcs: [
                                [0, 1, 2, 3]
                            ],
                            type: 'Polygon'
                        }
                    ]
                }
            }
        };

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

    private stream(stream: GeoStream): GeoStream {
        return {
            point: (x: number, y: number) => stream.point(x, y),
            lineStart: () => stream.lineStart(),
            lineEnd: () => stream.lineEnd(),
            polygonStart: () => stream.polygonStart(),
            polygonEnd: () => stream.polygonEnd()
        };

    }

}

customElements.define('map-view-port', MapViewPort); 
