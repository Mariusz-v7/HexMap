import { tile } from 'd3-tile';

export class MapFragmentTile {
    constructor() {
        const tileDef = tile()
            .size(50, 50)
            .zoomDelta(0.5)
            .wrap(false)
            ;

        const tiles = tileDef();
        //generate fragment 


        console.log(tiles);
    }

    private tileFactory(d: any) {
        console.log('factory', d)
    }
}
