import { ActionType } from './types';

export interface EnableDebugAction { 
    type: ActionType.ENABLE_DEBUG,
    debug: boolean
};

export function enableDebug(): EnableDebugAction {
    return {
        type: ActionType.ENABLE_DEBUG,
        debug: true
    };
}
