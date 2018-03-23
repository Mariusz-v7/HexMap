import { GeoStream } from 'd3-geo';

export class HexStream implements GeoStream {
    private dx = 0;
    private dy = 0;

    constructor(private stream: GeoStream, hexSize: number) {
        this.dx = hexSize * 2 * Math.sin(Math.PI / 3);
        this.dy = hexSize * 1.5;
    }

    get point() {
        return (x: number, y: number) => this.stream.point(
            x * this.dx / 2,
            (y - (2 - (y & 1)) / 3) * this.dy / 2
        )
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
