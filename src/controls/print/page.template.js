export default function pageTemplate({
  descriptionComponent,
  printMapComponent,
  titleComponent,
  scaleComponent,
  createdComponent
}) {
  return `
  ${titleComponent.render()}
  ${printMapComponent.render()}
  ${descriptionComponent.render()}
  <div class="o-print-scale_o_created">
  ${scaleComponent.render()}
  ${createdComponent.render()}
  </div>
`;
}
