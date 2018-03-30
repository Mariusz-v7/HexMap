import { select, Selection, BaseType } from 'd3-selection';
import { geoPath, geoProjection, GeoStream, GeoStreamWrapper, GeoPath } from 'd3-geo';
import { feature } from 'topojson';
import { Feature } from 'geojson';
import { HexProjection } from './hex-projection';
import { Topology } from './topology';
import { Tile } from './tile';

export class Renderer {
    private path: GeoPath<any, any>;

    constructor(private viewport: Selection<BaseType, any, any, any>, private topology: Topology, hexSize: number) {
        this.path = geoPath(new HexProjection(hexSize));
    }

    render() {
        const path = this.viewport.selectAll('path')
            .data(this.topology.objects.tiles.geometries);

        path.exit().remove();

        path.enter()
            .append('path')
            .attr('class', 'tile')
            .attr('d', this.calculatePath)
            .on('mouseover', tile => tile.onMouseEnter())
            .on('mousemove', tile => tile.onMouseMove())
            .on('mouseout', tile => tile.onMouseLeave())
            .on('click', tile => tile.onMouseClick())
            .each(function (tile) {
                tile.setElement(this);
            });

        path.merge(path)
            .each(function (tile) {
                tile.setElement(this);
            });
    }

    destroy() {

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
