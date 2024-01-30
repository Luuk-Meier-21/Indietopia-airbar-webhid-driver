import {TouchClient} from "./client";
import {createGestureTouchReferences} from "./gesture";

export default function airbarGestureDriver(): GestureTouchDriverBuilder | null {
  return new GestureTouchDriverBuilder() || null;
}

export class GestureTouchDriverBuilder {
  width = 1400;
  height = 900;
  persistDevice = false;
  deviceOptions: HIDDeviceRequestOptions | undefined;
  persistentDeviceKey = "gesture-driver-device";

  setSize(width: number, height: number): GestureTouchDriverBuilder {
    this.width = width;
    this.height = height;
    return this;
  }

  setPersistentDevice(isPersistent: boolean) {
    this.persistDevice = isPersistent;
  }

  setDeviceOptions(
    options: HIDDeviceRequestOptions
  ): GestureTouchDriverBuilder {
    this.deviceOptions = options;
    return this;
  }

  async requestDevice(): Promise<HIDDevice | null> {
    const devices = await navigator.hid.requestDevice(this.deviceOptions);

    navigator.hid.requestDevice();

    if (devices.length <= 0) {
      return Promise.reject(); // guard: device not found
    }

    return devices[0];
  }

  async start(): Promise<GestureTouchDriver> {
    const touchClient = new TouchClient(
      createGestureTouchReferences(this.width, this.height)
    );

    const device = await this.requestDevice();

    if (device === null) {
      return Promise.reject();
    }

    await device.open();

    return new GestureTouchDriver(touchClient, device);
  }
}

type TouchEventTypes = "touchstart" | "touchmove" | "touchend";
class GestureTouchDriver {
  lastDebounceTimerId: number = 0;
  lastTouchState: TouchEventTypes | null = null;

  constructor(public touchClient: TouchClient, public device: HIDDevice) {}

  convertInputReportToTouches(): void {
    this.device.addEventListener("inputreport", this.inputReportToTouchEvents);
  }

  inputReportToTouchEvents(event: HIDInputReportEvent): void {
    const {data} = event;
    const touches = this.touchClient.getTouches(data);

    const dispatchState = (state: TouchEventTypes) => {
      const event = new TouchEvent(state, {touches: touches});
      dispatchEvent(event);
      this.lastTouchState = state;
    };

    if (this.lastTouchState === null) {
      dispatchState("touchstart");
      return;
    }

    clearTimeout(this.lastDebounceTimerId);
    this.lastDebounceTimerId = setTimeout(() => {
      dispatchState("touchend");
    }, 30);

    dispatchState("touchmove");
  }

  // const touches = touchClient.calcAllTouches(data);
}
