// @ts-nocheck
import {GAxis} from "./utils";

// Interface for: one value from the HID input device
interface HIDInputMetric {
  get currentValue(): number;
  calcValue: (data: DataView) => number;
}

// Class implementing HIDInputMetric, calculates value based on 0 to 255 value and index of given max length.
class CompositeDimension implements HIDInputMetric {
  get currentValue(): number {}
  calcValue(data: DataView): number {}

  constructor(
    public clusterCount: number,
    public valueByteOffset: number,
    public indexByteOfsset: number
  ) {}
}

type RectBounds = {x: number; y: number; w: number; h: number};

interface HIDTouchBounds {
  get currentValue(): RectBounds;
  calcValue(): RectBounds;
  calcToTouch(): Touch;
}

class GTouch implements HIDInputBounds {
  get currentValue(): RectBounds {}
  calcValue(): RectBounds {}
  calcToTouch(): Touch {}
}

// TouchBoundsListFactory

class GestureTouchClient {
  constructor() {}

  getTouchList(): TouchList {}
}

type TouchEventType = "touchstart" | "touchcancel" | "touchmove" | "touchend";

class GestureTouchEventDispatcher {
  constructor() {}

  dispatch(
    eventType: TouchEventType,
    touches: TouchList,
    options?: Partial<TouchEvent> = {}
  ): void {}
}
