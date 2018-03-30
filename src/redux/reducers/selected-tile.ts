import { SelectTileAction } from "../actions/select-tile";
import { ActionType } from "../actions/types";

export interface SelectedTile {
    x?: number;
    y?: number;
    selected: boolean;
}

export function selectedTile(state: SelectedTile = { selected: false }, action: SelectTileAction): SelectedTile {
    if (action.type === ActionType.SELECT_TILE) {
        state = action.tile;
    }

    return state;
}