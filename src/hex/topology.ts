import { Tile } from './tile';

export class Topology {
    private dx = 0;
    private dy = 0;
    private m = 0;
    private n = 0;
    private _arcs: number[][][] = [];
    private tiles: Tile[] = [];

    constructor(private width: number, private height: number) {

        /**
         * ....... / \
         * .......    |
         */

        const horizontalAmount = 3;
        const verticalAmount = 3;

        for (let y = 0; y < verticalAmount; ++y) {
            for (let x = 0; x < horizontalAmount; ++x) {
                const dx = 2 * x + y % 2;
                const dy = 2 * y;

                this._arcs.push( // second position is !delta position!
                    [
                        [-1 + dx, dy], [1, -1]
                    ],
                    [
                        [dx, -1 + dy], [1, 1]
                    ],
                    [
                        [1 + dx, dy], [0, 1]
                    ],
                );
            }
        }

        this.tiles.push(new Tile([
            [
                3, 4, 5,
                ~12, ~10, ~2
            ]
        ]));

    }

    get transform() {
        return {
            scale: [1, 1],
            translate: [0, 0]
        };
    }

    get arcs() {
        return this._arcs;
    }

    get objects() {
        return {
            tiles: {
                type: 'GeometryCollection',
                geometries: this.tiles
            }
        };
    }
}