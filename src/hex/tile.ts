import { select, BaseType, Selection } from 'd3-selection'

export class Tile {
    private _arcs: number[][];
    private selection: Selection<BaseType, any, any, any>;
    private element: BaseType;
    private defaultAttributes: { [id: string]: any } = {
        fill: null
    };

    constructor(arcs: number[][]) {
        this._arcs = arcs;
    }

    init(element: BaseType) {
        if (this.element === element) {
            return;
        }

        this.element = element;
        this.selection = select(element);

        for (let attr in this.defaultAttributes) {
            this.selection.attr(attr, this.defaultAttributes[attr]);
        }
    }

    get type() {
        return 'Polygon';
    }

    get arcs() {
        return this._arcs;
    }

    onMouseEnter() {
        // this.element.attr('fill', 'red');
    }

    onMouseMove() {
    }

    onMouseLeave() {
        // this.element.attr('fill', 'gray');
    }

    onMouseClick() {
        this.selection.attr('fill', 'green');
    }
}
