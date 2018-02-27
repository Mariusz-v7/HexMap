import { tile } from 'd3-tile';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3'

import { Selection, BaseType } from 'd3-selection';

export class MapFragmentTile {

    constructor(private root: Selection<BaseType, any, any, any>) {

        var pi = Math.PI,
            tau = 2 * pi,
            tileSize = 128;

        var width = 960,
            height = 800;

        var tilee = tile()
            .size([width, height]);

        var zooom = zoom()
            // .scaleExtent([1 << 10, 1 << 11])
            .scaleExtent([tileSize, tileSize * 10])
            .on("zoom", zoomed);

        var map = this.root.append("div")
            .attr("class", "map")
            .style("width", width + "px")
            .style("height", height + "px");

        var layer = map.append("div")
            .attr("class", "layer");

        // Apply a zoom transform equivalent to projection.{scale,translate,center}.
        map.call(zooom)
            .call(zooom.transform, zoomIdentity
                .translate(width / 2, height / 2)
                .scale(tileSize * 2)
            );

        function zoomed() {
            var transform = event.transform;

            console.log(transform)

            var tiles = tilee
                .scale(transform.k)
                .translate([transform.x, transform.y])
                ();

            var image = layer
                .style("transform", stringify(tiles.scale, tiles.translate))
                .selectAll(".tile")
                .data(tiles, function (d) { return d; });

            image.exit()
                .each(function (d) { /* abort call */ })
                .remove();

            image.enter().append("svg")
                .attr("class", "tile")
                .style('width', `${tileSize}px`)
                .style('height', `${tileSize}px`)
                .style("left", function (d) { return d.x * tileSize + "px"; })
                .style("top", function (d) { return d.y * tileSize + "px"; })
                .each(function (d) {
                    // console.log(d);

                    const text = select(this).append('text');
                    text.text(`${d.x} x ${d.y}, z: ${d.z}`)
                        .attr('y', 20)
                        .attr('x', 10)

                });
        }

        function render(d, node) {
            // return d3.json("https://vector.mapzen.com/osm/roads/" + d[2] + "/" + d[0] + "/" + d[1] + ".json?api_key=vector-tiles-LM25tq4", function (error, json) {
            //     if (error) throw error;
            //     var k = Math.pow(2, d[2]) * 256; // size of the world in pixels

            //     d3.select(node).selectAll("path")
            //         .data(json.features.sort(function (a, b) { return a.properties.sort_key - b.properties.sort_key; }))
            //         .enter().append("path")
            //         .attr("class", function (d) { return d.properties.kind; })
            //         .attr("d", d3.geoPath()
            //             .projection(d3.geoMercator()
            //                 .scale(k / tau)
            //                 .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256])
            //                 .precision(0)));
            // });
        }

        function stringify(scale, translate) {
            var k = scale / tileSize, r = scale % 1 ? Number : Math.round;
            return "matrix3d(" + [
                k, 0, 0, 0, 0,
                k, 0, 0, 0, 0,
                k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1
            ] + ")";
        }

    }

    private tileFactory(d: any) {
        console.log('factory', d)
    }
}
