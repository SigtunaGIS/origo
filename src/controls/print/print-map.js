import olAttribution from 'ol/control/Attribution';
import olScaleLine from 'ol/control/ScaleLine';
import { dom, Component, Element as El } from '../../ui';
import Logo from './logo';
import mapUtils from '../../maputils';
import numberFormatter from '../../utils/numberformatter';
import NorthArrow from './north-arrow';

export default function PrintMap(options = {}) {
  const {
    logo,
    northArrow,
    map,
    viewer
  } = options;
  let {
    showNorthArrow
  } = options;

  let mapControls;
  let projection;
  let resolutions;
  let mapscaleLimit;
  let mapScale = '1:10000';

  const topRightMapControls = El({ cls: 'flex column align-start absolute top-right transparent z-index-ontop-middle' });
  const bottomLeftMapControls = El({ cls: 'flex column align-start absolute bottom-left transparent z-index-ontop-middle' });
  const bottomRightMapControls = El({ cls: 'flex column align-start absolute bottom-right transparent z-index-ontop-middle' });
  const logoComponent = Logo({ logo });
  const northArrowComponent = NorthArrow({ northArrow, map });

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
      projection = map.getView().getProjection();
      resolutions = viewer.getResolutions();
      map.getView().on('change:resolution', this.onZoomChange);
    },
    onRender() {
      this.dispatch('render');
    },
    toggleNorthArrow(display) {
      showNorthArrow = !showNorthArrow;
      northArrowComponent.setVisible(display);
    },
    addPrintControls() {
      const el = document.getElementById(bottomLeftMapControls.getId());
      el.appendChild(dom.html(logoComponent.render()));
      const el2 = document.getElementById(topRightMapControls.getId());
      el2.appendChild(dom.html(northArrowComponent.render()));
      northArrowComponent.onRotationChanged();
      northArrowComponent.setVisible({ showNorthArrow });

      const scaleLine = new olScaleLine({
        className: 'print-scale-line',
        target: bottomRightMapControls.getId()
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
        // document.getElementsByClassName('print-map-scale-text')[0].textContent = mapScale;
        document.getElementsByClassName('o-print-scale-map')[0].textContent = mapScale;
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
      `;
    }
  });
}
