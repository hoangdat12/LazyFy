import _ from "lodash";

const getInforData = ({ fields = [], objects = {} }) => {
  return _.pick(objects, fields);
};

export { getInforData };
