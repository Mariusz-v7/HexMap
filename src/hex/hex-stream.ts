import { GeoStream } from 'd3-geo';

export class HexStream implements GeoStream {
    private dx = 0;
    private dy = 0;

    constructor(private stream: GeoStream) {
        // this.dx = this.radius * 2 * Math.sin(Math.PI / 3);
        // this.dy = this.radius * 1.5;
    }

    get point() {
        return (x, y) => this.stream.point(0 + x * 30 + 50, y * 30 + 50);
        // return (x: number, y: number) => this.stream.point(x * this.dx / 2, (y - (2 - (y & 1)) / 3) * this.dy / 2)
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
