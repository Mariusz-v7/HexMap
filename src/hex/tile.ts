import { select, BaseType, Selection } from 'd3-selection';
import { store } from '../redux/store';
import { setSelectedTile } from '../redux/actions/select-tile';

export class Tile {
    private _arcs: number[][];
    private selection: Selection<BaseType, any, any, any>;
    private element: BaseType;

    constructor(arcs: number[][]) {
        this._arcs = arcs;
    }

    init(element: BaseType) {
        if (this.element === element) {
            return;
        }

        this.element = element;
        this.selection = select(element);
        this.selection.attr('class', 'tile');
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
        //todo: real x, y of a tile
        store.dispatch(setSelectedTile(0, 0));
    }
}
