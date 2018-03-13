import { Tile } from "./tile";

export class Topology {
    private position = [0, 0];

    move(x: number, y: number) {
        this.position[0] += x;
        this.position[1] += y;
    }

    get transform() {
        return {
            scale: [100, 100],
            translate: this.position
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
            new Tile([[0, 1, 2, 3]])
        ];

        return {
            tiles: {
                type: 'GeometryCollection',
                geometries: tiles
            }
        };
    }
}