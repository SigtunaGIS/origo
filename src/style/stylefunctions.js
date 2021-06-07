import defaultStyle from './stylefunctions/default';
import hovaStyle from './stylefunctions/hova';

const customStyles = {
  default: defaultStyle,
  hova: hovaStyle
};

export default function styleFunctions(customStyle, params) {
  if (customStyle in customStyles) {
    return customStyles[customStyle](params);
  }
  return customStyles.default(params);
}
