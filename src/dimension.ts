import {HIDMetric} from "./client";

export class CompositeDimension implements HIDMetric {
  private value: number = 0;

  constructor(
    public clusterLength: number,
    public maxSize: number,
    public valueRef: number,
    public indexRef: number,
    public inverted: boolean = false
  ) {}

  private setValue(value: number): number {
    this.value = value;
    return this.value;
  }

  public get currentValue(): number {
    return this.value;
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
