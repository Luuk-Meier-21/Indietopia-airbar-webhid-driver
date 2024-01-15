import {HIDTouchReference, RectBounds} from "./client";
import {CompositeDimension} from "./dimension";

export function createGestureTouchReferences(
  maxX: number,
  maxY: number,
  options?: {
    count?: number;
    start?: number;
    offset?: number;
  }
): GestureTouchReference[] {
  const count = options?.count || 3;
  const start = options?.start || 4;
  const offset = options?.offset || 9;

  return Array.from(Array(count)).map((_, i) => {
    const byteOffset = start + offset * i;
    return new GestureTouchReference(byteOffset, maxX, maxY);
  });
}

export class GestureTouchReference implements HIDTouchReference {
  private value: RectBounds = {x: 0, y: 0, w: 0, h: 0};

  constructor(
    public offset: number,
    public maxX: number,
    public maxY: number
  ) {}

  public get currentValue(): RectBounds {
    return this.value;
  }

  public calcValue(data: DataView): RectBounds {
    const of = (n: number) => this.offset + n;

    const x = new CompositeDimension(12, this.maxX, of(0), of(1));
    const y = new CompositeDimension(7, this.maxX, of(2), of(3));
    const w = new CompositeDimension(1, this.maxX, of(4), of(5));
    const h = new CompositeDimension(1, this.maxY, of(6), of(7));

    const cx = x.calcValue(data);
    const cy = y.calcValue(data);
    const cw = w.calcValue(data);
    const ch = h.calcValue(data);

    return {
      x: cx,
      y: cy,
      w: cw,
      h: ch,
    };
  }

  public calcToTouch(data: DataView): Touch {
    const bounds: RectBounds = this.calcValue(data);

    const touch = new Touch({
      identifier: 0,
      target: document,
      screenX: bounds.x,
      screenY: bounds.y,
      radiusX: bounds.w / 2,
      radiusY: bounds.h / 2,
    });

    return touch;
  }
}
