import { tile } from 'd3-tile';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3'

import { Selection, BaseType } from 'd3-selection';

export class MapFragmentTile {

    constructor(private root: Selection<BaseType, any, any, any>) {
    }

}
