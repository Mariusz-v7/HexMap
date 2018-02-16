import { select, Selection, BaseType } from 'd3-selection';
import { geoPath, geoProjection, GeoStream, GeoStreamWrapper, GeoPath } from 'd3-geo';
import { feature } from 'topojson';
import { Feature } from 'geojson';
import { HexProjection } from './hex-projection';
import { Topology } from './topology';

export class Renderer {
    private path: GeoPath<any, any>;

    constructor(private d3root: Selection<BaseType, any, any, any>, private topology: Topology) {
        this.path = geoPath(new HexProjection());
    }

    render() {
        this.d3root.append('g')
            .selectAll('path')
            .data(this.topology.objects.tiles.geometries)
            .enter()
            .append('path')
            .attr('d', d => this.calculatePath(d));
    }

    private calculatePath(d: { arcs: number[][], type: string }) {
        const conversion: any = feature(this.topology, d);

        const geoJsonFeature: Feature<any, any> = {
            geometry: conversion.geometry,
            properties: conversion.properties,
            type: 'Feature'
        };

        return this.path(geoJsonFeature, d);
    }
}
