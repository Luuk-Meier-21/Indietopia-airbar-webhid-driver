import {GAxis} from "./utils";

let dualTouchDistArray = new Array(3);

const screenSizeX = 1400;
const screenSizeY = 900;

let touches = 0;

const x = new GAxis(12, screenSizeX, 4, 5);
const y = new GAxis(7, screenSizeY, 6, 7);
const w = new GAxis(1, screenSizeX, 8, 9);
const h = new GAxis(1, screenSizeY, 10, 11);

const x2 = new GAxis(11, screenSizeX, 13, 14);
const y2 = new GAxis(7, screenSizeY, 15, 16);

function updateDualTouchDistArray(newDist: number) {
  dualTouchDistArray.shift();
  dualTouchDistArray.push(newDist);
}

function onCanvasDraw() {
  background("transparent");
  if (touches > 0) {
    // 1 touch:
    ellipse(x.lastValue, y.lastValue, 100, 100);
    fill("blue");
  }
  if (touches > 1) {
    // 2 touch:
    ellipse(x2.lastValue, y2.lastValue, 100, 100);
    fill("green");
  }
}

function onGestureInput(data: DataView) {
  touches = data.getUint8(0);

  const ax = x.calcValue(data);
  const ay = y.calcValue(data);
  const aw = w.calcValue(data);
  const ah = h.calcValue(data);

  const bx = x2.calcValue(data);
  const by = y2.calcValue(data);

  if (touches === 2) {
    const touchDist = dist(ax, ay, bx, by);
    updateDualTouchDistArray(touchDist);

    const distOffset = 20;

    const isAssending = dualTouchDistArray.every((dist, i) => {
      const prevDist: number = dualTouchDistArray[i - 1];

      return i === 0 || dist > prevDist + distOffset;
    });
    if (isAssending) {
      console.log("HI");
    }
    // console.log(isAssending ? "Zooming out" : "zoomming in");
  }
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
      // debugInput(data, 0, 6);

      onGestureInput(data);
    });
  });
});

document.addEventListener("p5-draw", onCanvasDraw);

navigator.hid.addEventListener("connect", (event: HIDConnectionEvent) => {
  console.log(event);
});
