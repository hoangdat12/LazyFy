import _ from "lodash";

const getInforData = ({ fields = [], objects = {} }) => {
  return _.pick(objects, fields);
};

const getSelectFromArray = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectFromArray = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

export { getInforData, getSelectFromArray, getUnSelectFromArray };
