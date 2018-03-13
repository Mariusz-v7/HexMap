import { GeoStream } from 'd3-geo';

export class HexStream implements GeoStream {
    constructor(private stream: GeoStream) { }

    get point() {
        return (x: number, y: number) => this.stream.point(x, y)
    }

    get lineStart() {
        return () => this.stream.lineStart();
    }

    get lineEnd() {
        return () => this.stream.lineEnd();
    }

    get polygonStart() {
        return () => this.stream.polygonEnd();
    }

    get polygonEnd() {
        return () => this.stream.polygonEnd();
    }
}
