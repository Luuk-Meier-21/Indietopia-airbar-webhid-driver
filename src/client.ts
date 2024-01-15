export interface HIDMetric {
  get currentValue(): number;
  calcValue(data: DataView): number;
}

export type RectBounds = {x: number; y: number; w: number; h: number};

export interface HIDTouchReference {
  get currentValue(): RectBounds;
  calcValue(data: DataView): RectBounds;
  calcToTouch(data: DataView): Touch;
}

export class GestureTouchClient {
  constructor(public touchRefList: HIDTouchReference[]) {}

  calcAllValues(data: DataView): RectBounds[] {
    return this.touchRefList.map((ref: HIDTouchReference) =>
      ref.calcValue(data)
    );
  }

  calcAllTouches(data: DataView): Touch[] {
    return this.touchRefList.map((ref: HIDTouchReference) =>
      ref.calcToTouch(data)
    );
  }

  calcTouchCount(data: DataView) {
    return data.getUint8(0);
  }
}

// export class HIDTouchClient {
//   constructor(offsetList: number[]) {}

//   /**
//    * Returns the `HIDTouchBounds`
//    */
//   getTouchBoundsFromOffset(data: DataView, offset: number): HIDTouchBounds {}

//   getTouchList(): TouchList {}
//   getTouchCount(): number {}
// }
