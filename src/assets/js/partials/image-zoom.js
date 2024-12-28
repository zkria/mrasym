/**
 * Create a magnifier glass for images zooming.
 *
 * @param {string} imgID - The id of the image to be zoomed.
 * @param {number} zoom - The zoom strength.
 * @returns {void}
 */
export function zoom(imgID, zoom) {
  const img = document.getElementById(imgID);
  if (!img) {
    console.error(`Image with ID ${imgID} not found.`);
    return;
  }

  const glass = document.createElement('div');
  glass.classList.add('img-magnifier-glass');
  img.parentElement.insertBefore(glass, img);

  glass.style.backgroundImage = `url('${img.src}')`;
  glass.style.backgroundRepeat = 'no-repeat';
  glass.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;

  const bw = 3;
  const w = glass.offsetWidth / 2;
  const h = glass.offsetHeight / 2;

  const moveMagnifier = (e) => {
    e.preventDefault();
    const pos = getCursorPos(e);
    let { x, y } = pos;

    x = Math.max(w / zoom, Math.min(x, img.width - w / zoom));
    y = Math.max(h / zoom, Math.min(y, img.height - h / zoom));

    glass.style.left = `${x - w}px`;
    glass.style.top = `${y - h}px`;
    glass.style.backgroundPosition = `-${(x * zoom - w + bw)}px -${(y * zoom - h + bw)}px`;
  };

  const getCursorPos = (e) => {
    const a = img.getBoundingClientRect();
    const x = e.pageX - a.left - window.pageXOffset;
    const y = e.pageY - a.top - window.pageYOffset;
    return { x, y };
  };

  const addEventListeners = (element, events, handler) => {
    events.forEach(event => element.addEventListener(event, handler));
  };

  const moveHandler = (e) => requestAnimationFrame(() => moveMagnifier(e));

  addEventListeners(glass, ['mousemove', 'touchmove'], moveHandler);
  addEventListeners(img, ['mousemove', 'touchmove'], moveHandler);
}
