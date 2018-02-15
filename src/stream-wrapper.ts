import { GeoStream } from 'd3-geo';

export function hexStream(stream: GeoStream): GeoStream {
    return {
        point: (x: number, y: number) => stream.point(x, y),
        lineStart: () => stream.lineStart(),
        lineEnd: () => stream.lineEnd(),
        polygonStart: () => stream.polygonStart(),
        polygonEnd: () => stream.polygonEnd()
    };

}

