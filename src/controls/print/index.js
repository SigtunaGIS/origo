import { Component, Element as El, Button, dom } from '../../ui';
import PrintComponent from './print-component';

const Print = function Print(options = {}) {
  const {
    icon = '#ic_print_24px',
    placement = ['menu'],
    logo = {},
    northArrow = {},
    printLegend = {},
    title = 'Skriv ut',
    showCreated = false,
    createdPrefix = '',
    showScale = true,
    rotation = 0,
    rotationStep = 1,
    leftFooterText = '',
    filename,
    mapInteractionsActive = false,
    supressResolutionsRecalculation = false,
    suppressNewDPIMethod = false
  } = options;
  let {
    showNorthArrow = true,
    showPrintLegend = true
  } = options;

  let viewer;
  let mapTools;
  let screenButtonContainer;
  let screenButton;
  let mapMenu;
  let menuItem;

  return Component({
    name: 'print',
    onInit() {
      if ('visible' in northArrow) {
        showNorthArrow = northArrow.visible;
      }
      if ('visible' in printLegend) {
        showPrintLegend = printLegend.visible;
      }
    },
    onAdd(evt) {
      viewer = evt.target;
      const printComponent = PrintComponent({
        logo,
        northArrow,
        printLegend,
        filename,
        map: viewer.getMap(),
        target: viewer.getId(),
        map: viewer.getMap(),
        viewer,
        showCreated,
        createdPrefix,
        showScale,
        showNorthArrow,
        showPrintLegend,
        rotation,
        rotationStep,
        leftFooterText,
        mapInteractionsActive,
        supressResolutionsRecalculation,
        suppressNewDPIMethod
      });
      if (placement.indexOf('screen') > -1) {
        mapTools = `${viewer.getMain().getMapTools().getId()}`;
        screenButtonContainer = El({
          tagName: 'div',
          cls: 'flex column'
        });
        screenButton = Button({
          cls: 'o-print padding-small margin-bottom-smaller icon-smaller round light box-shadow',
          click() {
            printComponent.render();
          },
          icon,
          tooltipText: title,
          tooltipPlacement: 'east'
        });
        this.addComponent(screenButton);
      }
      if (placement.indexOf('menu') > -1) {
        mapMenu = viewer.getControlByName('mapmenu');
        menuItem = mapMenu.MenuItem({
          click() {
            mapMenu.close();
            printComponent.render();
          },
          icon,
          title
        });
        this.addComponent(menuItem);
      }
      this.render();
    },
    render() {
      if (placement.indexOf('screen') > -1) {
        let htmlString = `${screenButtonContainer.render()}`;
        let el = dom.html(htmlString);
        document.getElementById(mapTools).appendChild(el);
        htmlString = screenButton.render();
        el = dom.html(htmlString);
        document.getElementById(screenButtonContainer.getId()).appendChild(el);
      }
      if (placement.indexOf('menu') > -1) {
        mapMenu.appendMenuItem(menuItem);
      }
      this.dispatch('render');
    }
  });
};

export default Print;
