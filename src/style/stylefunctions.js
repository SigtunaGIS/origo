import defaultStyle from './stylefunctions/default';
import hovaStyle from './stylefunctions/hova';
import op2022Style from './stylefunctions/op2022';

const customStyles = {
  default: defaultStyle,
  hova: hovaStyle,
  op2022: op2022Style
};

export default function styleFunctions(customStyle, params) {
  if (customStyle in customStyles) {
    return customStyles[customStyle](params);
  }
  return customStyles.default(params);
}
