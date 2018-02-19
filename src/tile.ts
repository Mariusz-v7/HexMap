export class Tile { 
    private _arcs: number[][];

    constructor(arcs: number[][]) {
        this._arcs = arcs;
    }
    
    get type() {
        return 'Polygon';
    }

    get arcs() {
        return this._arcs;
    }

    onMouseMove() {
        console.log('Test');
    }
}
