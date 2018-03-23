import { select, BaseType, Selection } from 'd3-selection'

export class Tile {
    private _arcs: number[][];
    private element: Selection<BaseType, any, any, any>;

    constructor(arcs: number[][]) {
        this._arcs = arcs;
    }

    setElement(element: BaseType) {
        this.element = select(element);
    }

    get type() {
        return 'Polygon';
    }

    get arcs() {
        return this._arcs;
    }

    onMouseEnter() {
        this.element.attr('fill', 'red');
    }

    onMouseMove() {
        console.log('Test');
    }

    onMouseLeave() {
        this.element.attr('fill', 'gray');
    }
}
