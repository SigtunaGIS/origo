import olAttribution from 'ol/control/Attribution';
import olScaleLine from 'ol/control/ScaleLine';
import { dom, Component, Element as El } from '../../ui';
import Logo from './logo';
import mapUtils from '../../maputils';
import numberFormatter from '../../utils/numberformatter';
import NorthArrow from './north-arrow';

export default function PrintMap(options = {}) {
  const {
    baseUrl,
    logo,
    northArrow,
    map,
    viewer
  } = options;
  let {
    showNorthArrow
  } = options;

  let mapControls;
  let scaleLine;

  const topRightMapControls = El({ cls: 'flex column align-start absolute top-right transparent z-index-ontop-middle' });
  const bottomLeftMapControls = El({ cls: 'flex column align-start absolute bottom-left transparent z-index-ontop-middle' });
  const bottomRightMapControls = El({ cls: 'flex column align-start absolute bottom-right transparent z-index-ontop-middle' });
  const logoComponent = Logo({ baseUrl, logo });
  const northArrowComponent = NorthArrow({ baseUrl, northArrow, map });

  const roundScale = (scale) => {
    const diff = scale % 10;
    const scaleValue = diff !== 0 ? scale += (10 - diff) : scale;
    return scaleValue;
  };

  const getCurrentMapScale = () => {
    const currentScale = roundScale(mapUtils.resolutionToScale(map.getView().getResolution(), projection));
    // return currentScale >= mapscaleLimit ? currentScale : mapscaleLimit;
    return currentScale;
  };

  return Component({
    onInit() {
      this.addComponent(bottomLeftMapControls);
      this.addComponent(bottomRightMapControls);
      this.on('change:toggleNorthArrow', this.toggleNorthArrow.bind(this));
      this.on('change:toggleScale', this.toggleScale.bind(this));
      this.on('change:setDPI', this.setDpi.bind(this));
    },
    onRender() {
      this.dispatch('render');
    },
    setDpi(resolution) {
      scaleLine.setDpi(resolution.resolution);
    },
    toggleNorthArrow(display) {
      showNorthArrow = !showNorthArrow;
      northArrowComponent.setVisible(display);
    },
    toggleScale(display) {
      const elScale = document.getElementById(bottomRightMapControls.getId());
      if (display.showScale === false) {
        elScale.style.display = 'none';
      } else {
        elScale.style.display = 'block';
      }
    },
    addPrintControls() {
      const el = document.getElementById(bottomLeftMapControls.getId());
      el.appendChild(dom.html(logoComponent.render()));
      const el2 = document.getElementById(topRightMapControls.getId());
      el2.appendChild(dom.html(northArrowComponent.render()));
      northArrowComponent.onRotationChanged();
      northArrowComponent.setVisible({ showNorthArrow });

      scaleLine = new olScaleLine({
        target: bottomRightMapControls.getId(),
        bar: true,
        text: true,
        steps: 2
      });
      const attribution = new olAttribution({
        className: 'print-attribution',
        collapsible: false,
        collapsed: false,
        target: bottomLeftMapControls.getId()
      });
      mapControls = [scaleLine, attribution];
      map.addControl(scaleLine);
      map.addControl(attribution);
    },
    onZoomChange() {
      try {
        const currentMapScale = numberFormatter(getCurrentMapScale());
        mapScale = `1:${currentMapScale}`;
        document.getElementsByClassName('print-map-scale-text')[0].textContent = mapScale;
      } catch (e) {
        console.log();
      }
    },
    changeDescription(evt) {
      description = evt.value;
      descriptionComponent.update();
      this.updatePageSize();
    },
    removePrintControls() { mapControls.forEach((mapControl) => map.removeControl(mapControl)); },
    render() {
      return `
      <div class="flex grow relative no-margin width-full height-full">
        ${topRightMapControls.render()}
        ${bottomLeftMapControls.render()}
        ${bottomRightMapControls.render()}
        <div id="${this.getId()}" class="no-margin width-full height-full">
        </div>
      </div>
      <span class="print-map-scale-text">${mapScale}</span>
      `;
    }
  });
}
