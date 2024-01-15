import {createGestureTouchReferences} from "./gesture";
import {GestureTouchClient} from "./client";

const maxX = 1400;
const maxY = 900;

const touchClient = new GestureTouchClient(
  createGestureTouchReferences(maxX, maxY)
);

enum TouchState {
  NONE = "",
  START = "touchstart",
  MOVE = "touchmove",
  END = "touchend",
}

let preState: TouchState = TouchState.NONE;
let endDebounceId: number = 0;

let savedTouches: Touch[] = [];
let savedTouchCount = 0;

window.addEventListener(TouchState.START, (ev) => {
  console.log(ev);
});

window.addEventListener(TouchState.MOVE, (ev) => {
  savedTouches = ev.touches as unknown as Touch[];
});

window.addEventListener(TouchState.END, () => {
  savedTouches = [];
  savedTouchCount = 0;
});

function onInput(data: DataView) {
  const touches = touchClient.calcAllTouches(data);
  savedTouchCount = touchClient.calcTouchCount(data);

  const dispatchState = (state: TouchState) => {
    const event = new TouchEvent(state, {touches: touches});
    dispatchEvent(event);
    preState = TouchState.START;
  };

  // Start
  if (preState === TouchState.NONE) {
    dispatchState(TouchState.START);
    return;
  }

  // End
  clearTimeout(endDebounceId);
  endDebounceId = setTimeout(() => {
    dispatchState(TouchState.END);
  }, 30);

  // Move
  dispatchState(TouchState.MOVE);
}

// Event listeners
document.addEventListener("p5-setup", async () => {
  const button = document.querySelector("button") as HTMLButtonElement;

  button.addEventListener("click", async function () {
    let devices = await navigator.hid.requestDevice({
      filters: [
        {
          productId: 257,
          vendorId: 5430,
        },
      ],
    });

    if (devices.length <= 0) {
      return; // guard: device not found
    }
    const device: HIDDevice = devices[0];
    await device.open();

    device.addEventListener("inputreport", async (event) => {
      const {data} = event;

      onInput(data);
    });
  });
});

function onCanvasDraw() {
  background("red");

  for (let i = 0; i < savedTouchCount; i++) {
    const touch = savedTouches[i];

    if (!touch) {
      return;
    }
    console.log(touch);
    ellipse(touch.screenX, touch.screenY, touch.radiusX, touch.radiusY);
    fill(75 * i);
  }

  // background("transparent");
  // if (touches > 0) {
  //   // 1 touch:
  //   ellipse(x.lastValue, y.lastValue, 100, 100);
  //   fill("blue");
  // }
  // if (touches > 1) {
  //   // 2 touch:
  //   ellipse(x2.lastValue, y2.lastValue, 100, 100);
  //   fill("green");
  // }
}

document.addEventListener("p5-draw", onCanvasDraw);
