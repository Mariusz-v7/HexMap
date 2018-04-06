import { select, BaseType, Selection } from 'd3-selection';
import { store } from '../redux/store';
import { setSelectedTile, clearSelectedTile } from '../redux/actions/select-tile';
import { selectedTile, SelectedTile } from '../redux/reducers/index';

export class Tile {
    private _arcs: number[][];
    private selection: Selection<BaseType, any, any, any>;
    private element: BaseType;
    private unsubscribe: any;

    constructor(arcs: number[][], private x: number, private y: number) {
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

        if (store.getState().debug) {
            this.selection.attr('debug-x', this.x);
            this.selection.attr('debug-y', this.y);
        }

        const state = store.getState().selectedTile;
        this.update(state);
    }

    private update(selectedTile: SelectedTile) {
        if (selectedTile.x === this.x && selectedTile.y === this.y && selectedTile.selected) {
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
        if (this.selection.classed('selected')) {
            store.dispatch(clearSelectedTile());
        } else {
            store.dispatch(setSelectedTile(this.x, this.y));
        }
    }
}
