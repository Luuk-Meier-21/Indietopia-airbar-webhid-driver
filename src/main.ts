import airbarGestureDriver from "./driver";

const deviceOptions = {
  filters: [
    {
      productId: 257,
      vendorId: 5430,
    },
  ],
};

async function addDriver(): Promise<void> {
  const driverBuilder = airbarGestureDriver();

  if (driverBuilder === null) {
    return;
  }

  const driver = await driverBuilder
    .setSize(1400, 900)
    .setDeviceOptions(deviceOptions)
    .start();

  driver.convertInputReportToTouches();
}

// Event listeners
document.addEventListener("DOMContentLoaded", async () => {
  const button = document.querySelector("button") as HTMLButtonElement;

  button.addEventListener("click", addDriver);
});
