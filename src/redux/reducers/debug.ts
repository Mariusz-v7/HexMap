import { EnableDebugAction } from '../actions/enable-debug';
import { ActionType } from '../actions/types';

export function debug(state = false, action: EnableDebugAction) {
    if (action.type === ActionType.ENABLE_DEBUG) {
        state = action.debug;
    }

    return state;
}
