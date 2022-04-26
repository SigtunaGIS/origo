import {
  Component, Button, Element as El, Collapse
} from '../../ui';
import printSettingsTemplate from './print-settings.template';
import CustomSizeControl from './custom-size-control';
import DescriptionControl from './description-control';
import MarginControl from './margin-control';
import OrientationControl from './orientation-control';
import SizeControl from './size-control';
import TitleControl from './title-control';
import CreatedControl from './created-control';
import ScaleControl from './scale-control';
import NorthArrowControl from './north-arrow-control';
import PrintLegendControl from './print-legend-control';
import RotationControl from './rotation-control';
import SetScaleControl from './set-scale-control';
//import ResolutionControl from './resolution-control';
import ShowScaleControl from './show-scale-control';

const PrintSettings = function PrintSettings(options = {}) {
  const {
    closeIcon = '#ic_close_24px',
    openIcon = '#ic_tune_24px',
    map,
    title,
    titlePlaceholderText,
    titleAlignment,
    titleSizes,
    titleSize,
    titleFormatIsVisible,
    description,
    descriptionPlaceholderText,
    descriptionAlignment,
    descriptionSizes,
    descriptionSize,
    descriptionFormatIsVisible,
    sizes,
    size,
    sizeCustomMinHeight,
    sizeCustomMaxHeight,
    sizeCustomMinWidth,
    sizeCustomMaxWidth,
    orientation,
    //resolutions,
    //resolution,
    scales,
    scaleInitial,
    showMargins,
    showCreated,
    showScale,
    showNorthArrow,
    showPrintLegend,
    rotation,
    rotationStep
  } = options;

const PrintSettings = function PrintSettings({
  closeIcon = '#ic_close_24px',
  initialSize,
  openIcon = '#ic_tune_24px',
  orientation = 'portrait',
  customSize,
  sizes,
  map,
  showCreated,
  showScale,
  showNorthArrow,
  rotationEnable
} = {}) {
  let headerComponent;
  let contentComponent;
  let openButton;
  let closeButton;
  let printSettingsContainer;
  let customSizeControl;
  let northArrowControl;
  let printLegendControl;
  let rotationControl;

  // Set tabindex for all settings buttons to include or exclude in taborder depending on if expanded or not
  const setTabIndex = function setTabIndex() {
    let idx = -1;
    if (openButton.getState() === 'hidden') {
      idx = 0;
      document.getElementById(closeButton.getId()).focus();
    } else {
      document.getElementById(openButton.getId()).focus();
    }
    for (let i = 0; i < document.getElementById(contentComponent.getId()).getElementsByTagName('button').length; i += 1) {
      document.getElementById(contentComponent.getId()).getElementsByTagName('button')[i].tabIndex = idx;
    }
    for (let j = 0; j < document.getElementById(contentComponent.getId()).getElementsByTagName('input').length; j += 1) {
      document.getElementById(contentComponent.getId()).getElementsByTagName('input')[j].tabIndex = idx;
    }
    for (let h = 0; h < document.getElementById(contentComponent.getId()).getElementsByTagName('textarea').length; h += 1) {
      document.getElementById(contentComponent.getId()).getElementsByTagName('textarea')[h].tabIndex = idx;
    }
  };

  const toggle = function toggle() {
    if (openButton.getState() === 'hidden') {
      openButton.setState('initial');
      closeButton.setState('hidden');
    } else {
      openButton.setState('hidden');
      closeButton.setState('initial');
    }
    const customEvt = new CustomEvent('collapse:toggle', {
      bubbles: true
    });
    setTabIndex();
    document.getElementById(openButton.getId()).dispatchEvent(customEvt);
  };

  const close = function close() {
    openButton.setState('initial');
    closeButton.setState('hidden');
    const customEvt = new CustomEvent('collapse:collapse', {
      bubbles: true
    });
    document.getElementById(openButton.getId()).dispatchEvent(customEvt);
  };

  return Component({
    close,
    onInit() {
      openButton = Button({
        cls: 'padding-small icon-smaller light text-normal',
        icon: openIcon,
        tooltipText: 'Visa inställningar',
        tooltipPlacement: 'east',
        state: 'initial',
        validStates: ['initial', 'hidden'],
        click() {
          toggle();
        }
      });
      closeButton = Button({
        cls: 'small round margin-top-small margin-right small icon-smaller grey-lightest',
        icon: closeIcon,
        state: 'hidden',
        validStates: ['initial', 'hidden'],
        click() {
          toggle();
        }
      });
      headerComponent = El({
        cls: 'flex row justify-end',
        style: { width: '100%' },
        components: [openButton, closeButton]
      });

      const orientationControl = OrientationControl({ orientation });
      const sizeControl = SizeControl({ initialSize, sizes });
      const titleControl = TitleControl({});
      const descriptionControl = DescriptionControl();
      const marginControl = MarginControl({ checked: true });
      const createdControl = CreatedControl({ checked: showCreated });
      /*const resolutionControl = ResolutionControl({
        initialResolution: resolution,
        resolutions
      });*/
      const showScaleControl = ShowScaleControl({ checked: showScale });
      northArrowControl = NorthArrowControl({ showNorthArrow });
      printLegendControl = PrintLegendControl({ showPrintLegend });
      rotationControl = map.getView().getConstraints().rotation(180) === 180 ? RotationControl({ rotation, rotationStep, map }) : undefined;
      customSizeControl = CustomSizeControl({
        state: initialSize === 'custom' ? 'active' : 'inital',
        height: customSize[0],
        width: customSize[1]
      });

      contentComponent = Component({
        onRender() { this.dispatch('render'); },
        render() {
          return printSettingsTemplate({
            id: this.getId(),
            customSizeControl,
            descriptionControl,
            marginControl,
            scaleControl,
            orientationControl,
            sizeControl,
            titleControl,
            createdControl,
            northArrowControl,
            rotationControl,
            setScaleControl,
            //resolutionControl,
            showScaleControl,
            printLegendControl
          });
        }
      });
      const components = [customSizeControl, marginControl, orientationControl, sizeControl, titleControl, descriptionControl, createdControl, northArrowControl, printLegendControl, setScaleControl, showScaleControl];
      if (rotationControl) { components.push(rotationControl); }
      contentComponent.addComponents(components);
      printSettingsContainer = Collapse({
        cls: 'no-print fixed flex column top-left rounded box-shadow bg-white overflow-hidden z-index-ontop-high',
        collapseX: true,
        collapseY: true,
        headerComponent,
        contentComponent
      });
      this.addComponent(printSettingsContainer);

      descriptionControl.on('change', (evt) => this.dispatch('change:description', evt));
      marginControl.on('change:check', (evt) => this.dispatch('change:margin', evt));
      orientationControl.on('change:orientation', (evt) => this.dispatch('change:orientation', evt));
      sizeControl.on('change:size', (evt) => this.dispatch('change:size', evt));
      sizeControl.on('change:size', this.onChangeSize.bind(this));
      customSizeControl.on('change:size', (evt) => this.dispatch('change:size-custom', evt));
      titleControl.on('change', (evt) => this.dispatch('change:title', evt));
      createdControl.on('change:check', (evt) => this.dispatch('change:created', evt));
      scaleControl.on('change:check', (evt) => this.dispatch('change:scale', evt));
      northArrowControl.on('change:check', (evt) => this.dispatch('change:northarrow', evt));
      printLegendControl.on('change:check', (evt) => this.dispatch('change:printlegend', evt));
      //resolutionControl.on('change:resolution', (evt) => this.dispatch('change:resolution', evt));
      setScaleControl.on('change:scale', (evt) => this.dispatch('change:scale', evt));
      showScaleControl.on('change:check', (evt) => this.dispatch('change:showscale', evt));
    },
    onChangeSize(evt) {
      const visible = evt.size === 'custom';
      customSizeControl.dispatch('change:visible', { visible });
    },
    onRender() {
      rotationControl.setRotation();
      this.dispatch('render');
      setTabIndex();
    },
    render() {
      return printSettingsContainer.render();
    }
  });
};

export default PrintSettings;
