const SOME_HUGE_INTERVAL = 1 << 30;

export function hang() {
  setInterval(() => {}, SOME_HUGE_INTERVAL);
}
