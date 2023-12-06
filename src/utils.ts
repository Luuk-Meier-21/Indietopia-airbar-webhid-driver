export function debugInput(data: DataView, from: number, to: number): void {
  let result = [];
  for (let i = from; i <= to; i++) {
    const value = data.getUint8(i);
    result.push(value);
  }
  console.table(result);
}

export const delay = async (milisec: number) =>
  new Promise((res) =>
    setTimeout(() => {
      res(null);
    }, milisec)
  );

export class GAxis {
  private lastRecordedValue: number = 0;

  constructor(
    public clusterLength: number,
    public maxSize: number,
    public valueRef: number,
    public indexRef: number,
    public inverted: boolean = false
  ) {}

  private setValue(value: number): number {
    this.lastRecordedValue = value;
    return this.lastRecordedValue;
  }

  public get lastValue(): number {
    return this.lastRecordedValue;
  }

  public calcValue(data: DataView): number {
    const value = data.getUint8(this.valueRef);
    const index = data.getUint8(this.indexRef);

    const absoluteValue =
      index > this.clusterLength
        ? this.maxSize
        : map(
            value,
            0,
            255,
            index <= 0 ? 0 : (this.maxSize / this.clusterLength) * index,
            (this.maxSize / this.clusterLength) * (index + 1)
          );

    if (this.inverted) {
      return this.setValue(this.maxSize - absoluteValue);
    }

    return this.setValue(absoluteValue);
  }
}
