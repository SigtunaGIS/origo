export default function printTemplate({
  id,
  customSizeControl,
  descriptionControl,
  marginControl,
  orientationControl,
  sizeControl,
  titleControl,
  createdControl,
  scaleControl,
  northArrowControl,
  rotationControl,
  setScaleControl,
  //resolutionControl,
  showScaleControl,
  printLegendControl
}) {
  return `
  <div id="${id}" class="flex column no-print padding-large width-16">
    <h6>Rubrik</h6>
    ${titleControl.render()}
    <div class="padding-top"></div>
    <h6>Beskrivning</h6>
    ${descriptionControl.render()}
    <div class="padding-top"></div>
    <h6>Storlek</h6>
    ${sizeControl.render()}
    <div class="padding-top"></div>
    ${customSizeControl.render()}
    <div class="padding-top"></div>
    <h6>Orientering</h6>
    ${orientationControl.render()}
    <div class="padding-top"></div>
      ${setScaleControl.render()}
    <div class="padding-top-large"></div>
    <div class="flex padding-right-small">
      <div class="grow text-normal">Använd marginaler</div>
      ${marginControl.render()}
    </div>
    <div class="padding-top-large"></div>
    <div class="flex padding-right-small">
      <div class="grow text-normal">Visa skala</div>
      ${scaleControl.render()}
    </div>
    <div class="padding-top-large"></div>
    <div class="flex padding-right-small">
      <div class="grow text-normal">Visa skapad tid</div>
      ${createdControl.render()}
    </div>
    <div class="padding-top-large"></div>
    <div class="flex padding-right-small">
      <div class="grow text-normal">Visa norrpil</div>
      ${northArrowControl.render()}
    </div>
    <div class="padding-top-large"></div>
    <div class="flex padding-right-small">
      <div class="grow text-normal">Visa legend</div>
      ${printLegendControl.render()}
    </div>
    <div class="padding-bottom-large">
      ${rotationControl ? rotationControl.render() : ''}
    </div>
  </div>`;
}
