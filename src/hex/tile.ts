import { select, BaseType, Selection } from 'd3-selection';
import { store } from '../redux/store';
import { setSelectedTile } from '../redux/actions/select-tile';
import { selectedTile, SelectedTile } from '../redux/reducers/index';

export class Tile {
    private _arcs: number[][];
    private selection: Selection<BaseType, any, any, any>;
    private element: BaseType;
    private unsubscribe: any;

    constructor(arcs: number[][]) {
        this._arcs = arcs;
    }

    init(element: BaseType) {
        if (this.element === element) {
            return;
        }

        this.unsubscribe = store.subscribe(() => {
            const state = store.getState().selectedTile;
            this.update(state);
        });

        this.element = element;
        this.selection = select(element);
        this.selection.attr('class', 'tile');

        const state = store.getState().selectedTile;
        this.update(state);
    }

    private update(selectedTile: SelectedTile) {
        //todo: tile coords
        if (selectedTile.x === 0 && selectedTile.y === 0 && selectedTile.selected) {
            this.selection.classed('selected', true);
        } else {
            this.selection.classed('selected', false);
        }

    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    get type() {
        return 'Polygon';
    }

    get arcs() {
        return this._arcs;
    }

    onMouseEnter() {
    }

    onMouseMove() {
    }

    onMouseLeave() {
    }

    onMouseClick() {
        //todo: real x, y of a tile
        store.dispatch(setSelectedTile(0, 0));
    }
}
