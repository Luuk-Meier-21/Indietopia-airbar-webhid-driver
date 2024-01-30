export interface HIDMetric {
  get currentValue(): number;
  calcValue(data: DataView): number;
}

export type RectBounds = {x: number; y: number; w: number; h: number};

export interface HIDTouchConfiguration {
  get lastValue(): RectBounds;
  calcValue(data: DataView): RectBounds;
  calcToTouch(data: DataView): Touch;
}

// A client that calculates touch based on data and touchrefs
export class TouchClient {
  constructor(public touchRefList: HIDTouchConfiguration[]) {}

  getRectBounds(data: DataView): RectBounds[] {
    return this.touchRefList.map((ref: HIDTouchConfiguration) =>
      ref.calcValue(data)
    );
  }

  getTouches(data: DataView): Touch[] {
    return this.touchRefList.map((ref: HIDTouchConfiguration) =>
      ref.calcToTouch(data)
    );
  }

  getTouchCount(data: DataView) {
    return data.getUint8(0);
  }
}
