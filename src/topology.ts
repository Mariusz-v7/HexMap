import { Tile } from "./tile";

export class Topology {

    get transform() {
        return {
            scale: [100, 100],
            translate: [50, 50]
        };
    }

    get arcs() {
        return [
            [[0, 0], [1, 0]],
            [[1, 0], [0, 1]],
            [[1, 1], [-1, 0]],
            [[0, 1], [0, -1]],
        ];
    }

    get objects() {
        const tiles: Tile[] = [
            {
                arcs: [
                    [0, 1, 2, 3]
                ],
                type: 'Polygon',
                data: 'test'
            }
        ];

        return {
            tiles: {
                type: 'GeometryCollection',
                geometries: tiles
            }
        };
    }
}