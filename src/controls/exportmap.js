import { Component, dom } from '../ui';

const Exportmap = function Exportmap(options = {}) {
  const {
    buttonText = 'Ladda ner kartan',
    attributionFontSize = options.attributionFontSize = '10',
    attributionFontColor = options.attributionFontColor = 'rgb(64, 64, 64)',
    scaleLineBgColor = options.scaleLineBgColor = 'rgb(255, 255, 255)',
    logoWidth = options.logoWidth = '150',
    logoHeight = options.logoHeight = '50',
    arrowWidth = options.arrowWidth = '100',
    arrowHeight = options.arrowHeight = '150',
    logoSrc = options.logoSrc = 'img\\png\\sigtuna_logo.png',
    arrowSrc = options.arrowSrc = 'img\\png\\north_arrow.png',
    icon = '#fa-download'
  } = options;

  let viewer;
  let mapMenu;
  let menuItem;
  let breakWidth;
  let breakHeight;
  let map;
  let alreadyDrawn = false;

  function renderCanvas(oldCanvas) {
    // create a new canvas
    const layers = document.querySelectorAll('.ol-layer canvas');
    const newCanvas = document.createElement('canvas');
    const mapContext = newCanvas.getContext('2d');

    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas'), (canvas) => {
      if (canvas.width > 0) {
        // Adjust breakpoints.
        breakWidth = canvas.width < oldCanvas.width && canvas.width > 0 ? canvas.width : oldCanvas.width;
        breakHeight = canvas.height < oldCanvas.height && canvas.height > 0 ? canvas.height : oldCanvas.height;
        const opacity = canvas.parentNode.style.opacity;
        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
        const transform = canvas.style.transform;
        // Get the transform parameters from the style's transform matrix
        const matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
        // Apply the transform to the export map context
        CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
        mapContext.drawImage(canvas, 0, 0);
        // set dimensions
      }
    });
    return newCanvas;
  }
  function getAttributions() {
    const layers = viewer.getLayers();
    const attributionsFunctions = [];

    function getAttributionsFunction(layer) {
      if (layer.getVisible()) {
        // If layer type is "GROUP" then it is not a real layer and does not have any source, we need to check its sublayers.
        if (layer.get('type') === 'GROUP') {
          const subLayers = layer.getLayers();
          subLayers.forEach((lyr) => getAttributionsFunction(lyr));
        } else {
          attributionsFunctions.push(layer.getSource().getAttributions());
        }
      }
    }

    layers.forEach((layer) => {
      getAttributionsFunction(layer);
    });

    const attributionHTMLs = [];
    attributionsFunctions.forEach((func) => {
      if (func) { // check is needed because layers without attribution return null.
        const attributionsList = func();
        attributionsList.forEach((att) => attributionHTMLs.push(att));
      }
    });

    const replacedAttributions = attributionHTMLs.map((a) => {
      // enkel lösning för att slippa anchor tag med länk till OSM
      if (a.indexOf('OpenStreetMap') > 0) {
        return '© OpenStreetMap';
      }
      return a.replace('&copy', '©');
    });
    return replacedAttributions.join(' ');
  }

  function getScaleInfo() {
    const el = document.getElementsByClassName('ol-scale-line-inner')[0];
    const widthStr = el.style.width;
    const heightStr = document.getElementsByClassName('ol-scale-line')[0].offsetHeight;
    const widthNumber = parseInt(widthStr, 10);
    const heightNumber = parseInt(heightStr, 10);

    return {
      innerHTML: el.innerHTML,
      width: widthNumber,
      height: heightNumber
    };
  }

  function rotateAndPaintImage(canvas, context, image) {
    context.translate(breakWidth - 150, 20);
    context.translate(arrowWidth / 2, arrowHeight / 2);
    context.rotate(map.getView().getRotation());
    context.drawImage(image, -arrowWidth / 2, -arrowHeight / 2, arrowWidth, arrowHeight);
  }

  function download(format) {
    const attr = getAttributions();
    const scaleInfo = getScaleInfo();

    map.once('postrender', (event) => {
      const canvasOriginal = document.getElementsByTagName('canvas')[0];
      // Render a canvas so that adding text to it doesn't dirty map view.
      const canvas = renderCanvas(canvasOriginal);
      const ctx = canvas.getContext('2d');
      // Set alpha channel on canvas to 1 to avoid transparency on the rest of the canvas objects.
      ctx.globalAlpha = 1;
      // var text = ctx.measureText('foo'); // TextMetrics object
      ctx.font = `${attributionFontSize}px Arial`;
      ctx.fillStyle = attributionFontColor;
      ctx.strokeStyle = attributionFontColor;
      // Background for the ol-scaleline
      ctx.fillStyle = scaleLineBgColor;
      ctx.fillRect((breakWidth - scaleInfo.width - 15), (breakHeight - scaleInfo.height - 10), (scaleInfo.width + 4), (scaleInfo.height + 4));
      ctx.fillStyle = attributionFontColor;
      ctx.font = '10px Arial';
      const textSize = ctx.measureText(scaleInfo.innerHTML); // TextMetrics object
      ctx.fillText(scaleInfo.innerHTML, breakWidth - 10 - (scaleInfo.width / 2) - (textSize.width / 2), breakHeight - 15);

      ctx.fillText(attr, 10, breakHeight - 5);

      ctx.beginPath();
      ctx.moveTo((breakWidth - scaleInfo.width - 10), (breakHeight - scaleInfo.height - 9));
      ctx.lineTo((breakWidth - scaleInfo.width - 10), (breakHeight - 9));
      ctx.lineTo((breakWidth - 15), (breakHeight - 9));
      ctx.lineTo((breakWidth - 15), (breakHeight - scaleInfo.height - 9));
      ctx.stroke();

      const logo = new Image();
      logo.onload = function () {
        ctx.drawImage(logo, 20, 20, logoWidth, logoHeight);
        const northArrow = new Image();
        northArrow.onload = function () {
          if (map.getView().getRotation() === 0) {
            ctx.drawImage(northArrow, 25, 80, arrowWidth, arrowHeight);
          } else {
            rotateAndPaintImage(canvas, ctx, northArrow);
          }
          const fileName = format === 'image/png' ? 'map.png' : 'map.jpeg';
          canvas.toBlob((blob) => {
            if (navigator.msSaveBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              const link = document.createElement('a');
              const objectURL = URL.createObjectURL(blob);
              link.setAttribute('download', fileName);
              link.setAttribute('href', objectURL);
              document.getElementsByTagName('div')[0].appendChild(link);
              link.click();
              document.getElementsByTagName('div')[0].removeChild(link);
              URL.revokeObjectURL(objectURL);
            }
          }, format);
        };
        northArrow.src = arrowSrc;
      };
      logo.src = logoSrc;
    });
    map.renderSync();
  }


  /**
 * Using canvas.msToBlob() is much easier but it always turns a blob to a png.
 * This polyfill is needed if we want to choose format other than png.
 */
  (function runPolyfills() {
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value(callback, type, quality) {
          const dataURL = this.toDataURL(type, quality).split(',')[1];
          setTimeout(() => {
            const binStr = atob(dataURL);
            const len = binStr.length;
            const arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }
            callback(new Blob([arr], { type: type || 'image/png' }));
          });
        }
      });
    }
    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
        value(predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }

          const o = Object(this);

          // 2. Let len be ? ToLength(? Get(O, "length")).
          const len = o.length >>> 0;

          // 3. If IsCallable(predicate) is false, throw a TypeError exception.
          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          }

          // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
          const thisArg = arguments[1];

          // 5. Let k be 0.
          let k = 0;

          // 6. Repeat, while k < len
          while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            const kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
              return kValue;
            }
            // e. Increase k by 1.
            k += 1;
          }

          // 7. Return undefined.
          return undefined;
        },
        configurable: true,
        writable: true
      });
    }
  }());

  function createFormatsContainer(opts) {
    const el = `
      <div id="${opts.id}" class="folded-export-element">
        <span id="o-export-format-png" class="o-export-format"> PNG </span>
        <span id="o-export-format-jpg" class="o-export-format"> JPG </span>
      </div>`;
    return el;
  }

  let fc;
  let formatsContainerVisible = false;

  function toggleFormatContainter() {
    if (formatsContainerVisible) {
      setTimeout(() => {
        fc.classList.add('folded-export-element');
        fc.classList.remove('unfolded-export-element');
        formatsContainerVisible = false;
      }, 50);
    } else {
      setTimeout(() => {
        fc.classList.add('unfolded-export-element');
        fc.classList.remove('folded-export-element');
        formatsContainerVisible = true;
      }, 50);
    }
  }

  function createFormatSelector(id) {
    if (alreadyDrawn) {
      toggleFormatContainter();
      return;
    }

    const formatsContainerId = 'o-select-format-button';
    const el = document.getElementById(id).parentElement;
    const formatsContainerString = createFormatsContainer({
      id: formatsContainerId
    });
    const formatsContainerElement = dom.html(formatsContainerString);
    // to support IE otherwise el.after(formatsContainerElement) would work perfectly.
    el.parentNode.insertBefore(formatsContainerElement, el.nextSibling);
    el.appendChild(formatsContainerElement);
    // dom.html method used above doesn't create a real element. To be able to use classList we need to use getElementBtId
    fc = document.getElementById(formatsContainerId);
    setTimeout(() => {
      fc.classList.add('unfolded-export-element');
      fc.classList.remove('folded-export-element');
    }, 100);

    const pngButton = document.getElementById('o-export-format-png');
    const jpgButton = document.getElementById('o-export-format-jpg');

    pngButton.addEventListener('click', (e) => {
      download('image/png');
      menuItem.close();
      toggleFormatContainter();
      e.stopPropagation();
    });
    jpgButton.addEventListener('click', (e) => {
      download('image/jpg');
      menuItem.close();
      toggleFormatContainter();
      e.stopPropagation();
    });

    alreadyDrawn = true;
    formatsContainerVisible = true;
  }

  const component = Component({
    name: 'exportmap',
    onAdd(evt) {
      viewer = evt.target;
      map = viewer.getMap();
      mapMenu = viewer.getControlByName('mapmenu');
      menuItem = mapMenu.MenuItem({
        click() {
          createFormatSelector(this.getId());
        },
        icon,
        title: buttonText
      });
      this.addComponent(menuItem);
      this.render();
    },
    render() {
      mapMenu.appendMenuItem(menuItem);
      this.dispatch('render'); // this triggers menuItem.onRender()
    }
  });
  return component;
};

export default Exportmap;
