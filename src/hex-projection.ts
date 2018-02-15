import { GeoStreamWrapper, GeoStream } from 'd3-geo';
import { HexStream } from './hex-stream';

export class HexProjection implements GeoStreamWrapper {
    get stream() {
        return (stream: GeoStream) => new HexStream(stream);
    }
}