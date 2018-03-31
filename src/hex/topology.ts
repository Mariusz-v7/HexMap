import { Tile } from './tile';

export class Topology {
    private dx = 0;
    private dy = 0;
    private m = 0;
    private n = 0;
    private _arcs: number[][][] = [];
    private tiles: Tile[] = [];

    constructor(private horizontalAmount: number, private verticalAmount: number,
        private fragmentX: number, private fragmentY: number) {

        /**
         * ....... / \
         * .......    |
         */

        const upperEdges: number[][][] = [];

        for (let x = -1; x < horizontalAmount + 2; ++x) {
            if (!upperEdges[x]) {
                upperEdges[x] = [];
            }

            for (let y = 0; y < verticalAmount + 1; ++y) {
                if (!upperEdges[x][y]) {
                    upperEdges[x][y] = [];
                }

                const dx = 2 * x + y % 2;
                const dy = 2 * y;

                if (x !== -1) {
                    this._arcs.push([
                        [-1 + dx, dy], [1, -1]
                    ]);

                    upperEdges[x][y][0] = this._arcs.length - 1;
                }

                if (x !== -1 || y % 2 === 1) {
                    this._arcs.push([
                        [dx, -1 + dy], [1, 1]
                    ]);

                    upperEdges[x][y][1] = this._arcs.length - 1;
                }

                this._arcs.push([
                    [1 + dx, dy], [0, 1]
                ]);

                upperEdges[x][y][2] = this._arcs.length - 1;
            }
        }


        for (let x = 0; x < horizontalAmount; ++x) {
            for (let y = 0; y < verticalAmount; ++y) {

                const realX = x + this.fragmentX * horizontalAmount;
                const realY = y + this.fragmentY * verticalAmount;

                if (y % 2 === 0) {
                    this.tiles.push(new Tile([
                        [
                            upperEdges[x][y][0],
                            upperEdges[x][y][1],
                            upperEdges[x][y][2],
                            ~upperEdges[x][y + 1][0],
                            ~upperEdges[x - 1][y + 1][1],
                            ~upperEdges[x - 1][y][2],
                        ]
                    ], realX, realY));
                } else {
                    this.tiles.push(new Tile([
                        [
                            upperEdges[x][y][0],
                            upperEdges[x][y][1],
                            upperEdges[x][y][2],
                            ~upperEdges[x + 1][y + 1][0],
                            ~upperEdges[x][y + 1][1],
                            ~upperEdges[x - 1][y][2],
                        ]
                    ], realX, realY));
                }

            }
        }


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