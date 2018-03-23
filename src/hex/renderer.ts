import { select, Selection, BaseType } from 'd3-selection';
import { geoPath, geoProjection, GeoStream, GeoStreamWrapper, GeoPath } from 'd3-geo';
import { feature } from 'topojson';
import { Feature } from 'geojson';
import { HexProjection } from './hex-projection';
import { Topology } from './topology';
import { Tile } from './tile';

export class Renderer {
    private path: GeoPath<any, any>;

    constructor(private viewport: Selection<BaseType, any, any, any>, private topology: Topology) {
        this.path = geoPath(new HexProjection());
    }

    render() {
        const path = this.viewport.selectAll('path')
            .data(this.topology.objects.tiles.geometries);

        path.exit().remove();

        path.enter()
            .append('path')
            .attr('class', 'tile')
            .attr('d', this.calculatePath)
            .on('mousemove', this.mousemove)
            ;
    }

    destroy() {

    }

    private mousemove = (tile: Tile) => {
        tile.onMouseMove();
    }

    private calculatePath = (tile: Tile) => {
        const conversion: any = feature(this.topology, tile);

        const geoJsonFeature: Feature<any, any> = {
            geometry: conversion.geometry,
            properties: conversion.properties,
            type: 'Feature'
        };

        return this.path(geoJsonFeature, tile);
    }
}
