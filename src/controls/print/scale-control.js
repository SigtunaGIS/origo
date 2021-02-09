import Button from '../../ui/button';

export default function ScaleControl(options = {}) {
  let {
    checked
  } = options;


  const checkIcon = '#ic_check_circle_24px';
  const uncheckIcon = '#ic_radio_button_unchecked_24px';

  const getCheckIcon = (visible) => {
    const isVisible = visible ? checkIcon : uncheckIcon;
    toggleMapScale();
    return isVisible;
  };

  const toggleMapScale = () => {
    const target = document.getElementsByClassName('print-map-scale-text')[0];
    try {
      if (target.style.display === 'block' || target.style.display === '') {
        target.style.display = 'none';
      } else {
        target.style.display = 'block';
      }
    } catch (e) {
      return false;
    }
  };

  return Button({
    cls: 'round small icon-smaller no-shrink',
    click() {
      checked = !checked;
      this.setIcon(getCheckIcon(checked));
      this.dispatch('change:check', { checked });
    },
    style: {
      'align-self': 'center'
    },
    icon: getCheckIcon(checked)
  });
}
