import { MapFragmentTile } from './map-fragment-tile';

interface Offset {
    x: number;
    y: number;
}

export class MapFragmentTileGenerator {
    private tiles: MapFragmentTile[];
    private horizontalAmount: number;
    private verticalAmount: number;

    constructor(private tileWidth: number, private tileHeight: number,
        private viewPortWidth: number, private viewPortHeight: number,
        private hexSize: number,
        private hexAmountHorizontal: number, private hexAmountVertical: number) {

        this.horizontalAmount = Math.ceil(viewPortWidth / tileWidth) + 1;
        this.verticalAmount = Math.ceil(viewPortHeight / tileHeight) + 1;

        console.debug(`Maximum amount horizontal: ${this.horizontalAmount}, maximum amount vertical: ${this.verticalAmount}`);

        this.tiles = [];

        for (let i = 0; i < this.horizontalAmount * this.verticalAmount; ++i) {
            this.tiles[i] = undefined;
        }

        console.debug(`Maximum tiles amount: ${this.tiles.length}`);
    }

    public generate(offset: Offset) {
        this.clearInvisible(offset);

        const initialPosition = {
            x: -Math.ceil(offset.x / this.tileWidth),
            y: -Math.ceil(offset.y / this.tileHeight)
        };

        for (let x = initialPosition.x; x < initialPosition.x + this.horizontalAmount; ++x) {
            for (let y = initialPosition.y; y < initialPosition.y + this.verticalAmount; ++y) {
                this.computePosition(x, y, offset);
            }
        }

        return [...this.tiles];
    }

    private clearInvisible(offset: Offset) {
        this.tiles = this.tiles
            .map(tile => {
                if (tile === undefined || this.isTileVisible(tile.x, tile.y, offset)) {
                    return tile;
                }

                tile.destroy();

                return undefined;
            });
    }

    private computePosition(x: number, y: number, offset: Offset) {
        const tileIndex = this.findIndex(x, y);

        if (this.isTileVisible(x, y, offset)) {
            if (tileIndex === -1) {
                const tile = this.createTile(x, y);

                const emptyIndex = this.findEmptyIndex(x, y);
                if (emptyIndex > -1) {
                    this.tiles[emptyIndex] = tile;
                } else {
                    // should not happen?
                    console.debug(`Tile index: ${tileIndex}, emptyIndex: ${emptyIndex}, x: ${x}, y: ${y}`, this.tiles);
                    throw Error('There is no free space in the array');
                }
            } // else - leave it in array
        } else {
            if (tileIndex > -1) {
                this.tiles[tileIndex] = undefined;
            }
        }
    }

    private isTileVisible(x: number, y: number, offset: Offset) {
        const topLeftCorner = {
            x: x * this.tileWidth,
            y: y * this.tileHeight
        };

        const topRightCorner = {
            x: topLeftCorner.x + this.tileWidth,
            y: topLeftCorner.y
        };

        const bottomLeftCorner = {
            x: topLeftCorner.x,
            y: topLeftCorner.y + this.tileHeight
        };

        const bottomRightCorner = {
            x: topRightCorner.x,
            y: topRightCorner.y + this.tileHeight
        };

        const isTopRightCornerVisible = this.isPixelVisible(topRightCorner, offset);
        const isTopLeftCornerVisible = this.isPixelVisible(topLeftCorner, offset);
        const isBottomRightCornerVisible = this.isPixelVisible(bottomRightCorner, offset);
        const isBottomLeftCornerVisible = this.isPixelVisible(bottomLeftCorner, offset);

        const isVisible = isTopLeftCornerVisible || isTopRightCornerVisible || isBottomLeftCornerVisible || isBottomRightCornerVisible;

        return isVisible;
    }

    private isPixelVisible(pixel: { x: number, y: number }, offset: Offset) {
        const viewPortLeftBorder = -offset.x;
        const viewPortRightBorder = -offset.x + this.viewPortWidth;
        const viewPortTopBorder = -offset.y;
        const viewPortBottomBorder = -offset.y + this.viewPortHeight;

        return pixel.x >= viewPortLeftBorder && pixel.x <= viewPortRightBorder &&
            pixel.y >= viewPortTopBorder && pixel.y <= viewPortBottomBorder;
    }

    private findEmptyIndex(x: number, y: number) {
        return this.tiles.findIndex(tile => tile === undefined);
    }

    private tileExists(x: number, y: number) {
        return !!this.getExistingTile(x, y);
    }

    private findIndex(x: number, y: number) {
        return this.tiles
            .filter(tile => tile !== undefined)
            .findIndex(tile => tile.x === x && tile.y === y);
    }

    private createTile(x: number, y: number): MapFragmentTile {
        return new MapFragmentTile({ x, y }, this.tileWidth, this.tileHeight, this.hexSize,
            this.hexAmountHorizontal, this.hexAmountVertical);
    }

    private getExistingTile(x: number, y: number) {
        return this.tiles
            .filter(tile => tile !== undefined)
            .find(tile => tile.x === x && tile.y === y);
    }
}
