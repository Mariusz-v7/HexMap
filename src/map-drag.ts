import { select, Selection, BaseType } from 'd3-selection';
import { drag, D3DragEvent } from 'd3-drag';
import { event } from 'd3';
import { Topology } from './topology';
import { Renderer } from './renderer';

export class MapDrag {
    constructor(private mapContainer: Selection<BaseType, any, any, any>,
        private topology: Topology, private renderer: Renderer) {
        this.mapContainer.call(this.dragDef)
    }

    get dragDef() {
        return drag()
            .clickDistance(50)
            .on('start', () => {
                const e = <D3DragEvent<any, any, any>>event;
                if (e.active) {
                    // console.log('start', event);
                }
            })
            .on('drag', () => {
                const e = <D3DragEvent<any, any, any>>event;
                if (e.active) {
                    this.topology.move(e.dx, e.dy);
                    this.renderer.render();
                }
            })
            .on('end', () => {
                const e = <D3DragEvent<any, any, any>>event;
                if (e.active) {
                    // console.log('end', event);
                }
            })
            ;
    }

}
