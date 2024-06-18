import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const D4 = <Icon name="dice-d4" size={30} color="#000000" />;
const D6 = <Icon name="dice-d6" size={30} color="#000000" />;
const D8 = <Icon name="dice-d8" size={30} color="#000000" />;
const D10 = <Icon name="dice-d10" size={30} color="#000000" />;
const D12 = <Icon name="dice-d12" size={30} color="#000000" />;
const D20 = <Icon name="dice-d20" size={30} color="#000000" />;
const D100 = <Icon name="cash-100" size={30} color="#000000" />;
const addValue = <Icon name="numeric-positive-1" size={30} color="#000000"/>
const subtractValue = <Icon name="numeric-negative-1" size={30} color="#000000"/>
const Close = <Icon name="close-circle" size={30} color="#000000"/>

const DiceIcons = {
  D4,
  D6,
  D8,
  D10,
  D12,
  D20,
  D100,
};
const ValueIcons = {
  addValue,
  subtractValue
}

export {DiceIcons, ValueIcons, Close}
