export function isWindowScrolledToRight(tolerance = 1) {
  // Get the total scrollable width
  const maxScrollLeft =
    document.documentElement.scrollWidth - window.innerWidth;
  // Check if the scroll position is at or near the maximum scrollable width
  return maxScrollLeft - window.scrollX <= tolerance;
}
