import { select, Selection, BaseType } from 'd3-selection';
import { geoPath, geoProjection, GeoStream, GeoStreamWrapper, GeoPath } from 'd3-geo';
import { feature } from 'topojson';
import { Feature } from 'geojson';
import { HexProjection } from './hex-projection';
import { Topology } from './topology';
import { Tile } from './tile';
import { mesh } from 'topojson';

export class Renderer {
    private path: GeoPath<any, any>;

    constructor(private viewport: Selection<BaseType, any, any, any>, private topology: Topology, hexSize: number) {
        this.path = geoPath(new HexProjection(hexSize));
    }

    render() {
        this.renderTiles();
        this.renderMesh();
    }

    destroy() {
        const path = this.viewport.selectAll('path')
            .data(this.topology.objects.tiles.geometries)
            .each(tile => tile.destroy())
            ;
    }

    private renderTiles() {
        this.viewport.selectAll('path')
            .data(this.topology.objects.tiles.geometries)
            .enter()
            .append('path')
            .attr('d', this.calculatePath)
            .on('mouseover', tile => tile.onMouseEnter())
            .on('mousemove', tile => tile.onMouseMove())
            .on('mouseout', tile => tile.onMouseLeave())
            .on('click', tile => tile.onMouseClick())
            .each(function (tile) {
                tile.init(this);
            });
    }

    private renderMesh() {
        const meshResult = mesh(this.topology, this.topology.objects.tiles);

        this.viewport.append('path')
            .datum(meshResult)
            .attr('class', 'mesh')
            .attr('fill', 'none')
            .attr('d', this.path);
    }

    private calculatePath = (tile: Tile) => {
        const geoJsonFeature = feature(this.topology, tile);

        return this.path(geoJsonFeature);
    }
}
