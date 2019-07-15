export default function range(start, end, step) {
  step = typeof step === 'undefined' ? 1 : step
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)
}
