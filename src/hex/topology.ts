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

        const verticalAmount = 4;
        const horizontalAmount = 2;

        for (let y = 0; y < verticalAmount + 1; ++y) {
            for (let x = -1; x < horizontalAmount; ++x) {
                const dx = 2 * x + y % 2;
                const dy = 2 * y;

                if (x !== -1) {
                    this._arcs.push([
                        [-1 + dx, dy], [1, -1]
                    ]);
                }

                if (x !== -1 || y % 2 === 1) {
                    this._arcs.push([
                        [dx, -1 + dy], [1, 1]
                    ]);
                }

                this._arcs.push([
                    [1 + dx, dy], [0, 1]
                ]);
            }
        }

        for (let y = 0; y < verticalAmount; ++y) {
            for (let x = 0; x < horizontalAmount; ++x) {
                const amountOfEvenRows = Math.ceil(y / 2);
                const amountOfOddRows = Math.floor(y / 2);

                let topEdgesAmountOnEvenRows = amountOfEvenRows * (1 + 3 * horizontalAmount);
                if (y > 1) {
                    topEdgesAmountOnEvenRows -= (amountOfEvenRows - 1);
                }
                const topEdgesAmountOnOddRows = amountOfOddRows * (2 + 3 * horizontalAmount);
                const amountOfEdgesInPreviousRows = topEdgesAmountOnEvenRows + topEdgesAmountOnOddRows ;

                const even = 1 + x * 3;
                const odd = 2 + x * 3;

                // const top = 1 + x + 2 * x;
                const top = amountOfEdgesInPreviousRows + even * ((y + 1) % 2) + odd * (y % 2);
                const bottom = horizontalAmount * 3 + x * 3 + 3;

                console.log(x, y, '---------', top, bottom)

                this.tiles.push(new Tile([
                    [
                        top, top + 1, top + 2,
                        ~(bottom), ~(bottom - 2), ~(top + 2 - 3)
                    ]
                ]));
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