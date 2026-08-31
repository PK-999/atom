export interface PaddedExtent {
  maximum: number;
  minimum: number;
  span: number;
}

const DOMAIN_PADDING_RATIO = 0.05;

export function getPaddedExtent(values: ReadonlyArray<number>): PaddedExtent {
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) {
    return { maximum: 0.5, minimum: -0.5, span: 1 };
  }

  const observedMinimum = Math.min(...finiteValues);
  const observedMaximum = Math.max(...finiteValues);
  const observedSpan = observedMaximum - observedMinimum;
  const padding =
    observedSpan === 0
      ? Math.max(Math.abs(observedMinimum) * DOMAIN_PADDING_RATIO, 1)
      : observedSpan * DOMAIN_PADDING_RATIO;
  const minimum = observedMinimum - padding;
  const maximum = observedMaximum + padding;

  return { maximum, minimum, span: maximum - minimum };
}
