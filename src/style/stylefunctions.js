import defaultStyle from './stylefunctions/default';
import hovaStyle from './stylefunctions/hova';// Sigtuna
import op2022Style from './stylefunctions/op2022';// Sigtuna

const customStyles = {
  default: defaultStyle,
  hova: hovaStyle,// Sigtuna
  op2022: op2022Style// Sigtuna
};

export default function styleFunctions(customStyle, params) {
  if (customStyle in customStyles) {
    return customStyles[customStyle](params);
  }
  return customStyles.default(params);
}
