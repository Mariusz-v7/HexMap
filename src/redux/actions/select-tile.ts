import { ActionType } from './types';
import { SelectedTile } from '../reducers/selected-tile';

export interface SelectTileAction {
    type: ActionType.SELECT_TILE;
    tile: SelectedTile;
}

export function setSelectedTile(x: number, y: number): SelectTileAction {
    return {
        type: ActionType.SELECT_TILE,
        tile: { x, y, selected: true },
    };
}
