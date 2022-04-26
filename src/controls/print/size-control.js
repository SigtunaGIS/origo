import { Button, ToggleGroup } from '../../ui';

const titleCase = function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function SizeControl({ initialSize, sizes }) {
  const sizeButtons = sizes.map((size) => {
    if (size === 'custom') {
      return Button({
        cls: 'grow light text-smaller',
        text: 'Anpassa',
        state: initialSize === size ? 'active' : 'initial',
        style: { width: `${String(round2(100 - round2(100 / sizes.length, 1) * (sizes.length - 1), 1))}%` },
        ariaLabel: 'Anpassa egen storlek'
      });
    }
    return Button({
      cls: 'grow light text-smaller',
      text: titleCase(size),
      state: initialSize === size ? 'active' : 'initial',
      style: { width: `${String(round2(100 / sizes.length, 1))}%` },
      ariaLabel: titleCase(size)
    });
  });

  const sizeControl = ToggleGroup({
    cls: 'flex button-group divider-horizontal rounded bg-inverted border',
    components: sizeButtons,
    style: { height: '2rem', display: 'flex' }
  });
  sizeButtons.forEach((sizeButton, index) => {
    sizeButton.on('click', () => sizeControl.dispatch('change:size', { size: sizes[index] }));
  });

  return sizeControl;
}
