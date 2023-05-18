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

const removeNullOrUndefinedFromRequest = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key];
    }
  });
  return obj;
};

/*
  obj = {
    color: {
      red: 10,
      blue: 20
    }
  }
  convert 
  db.collection.updateOne({
    `color.red`: 10,
    `color.blue`: 10,
  })
*/

const UpdateNestedObjectParse = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const objectResponse = UpdateNestedObjectParse(obj[key]);
      Object.keys(objectResponse).forEach((k) => {
        final[`${key}.${k}`] = objectResponse[k];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

export {
  getInforData,
  getSelectFromArray,
  getUnSelectFromArray,
  removeNullOrUndefinedFromRequest,
  UpdateNestedObjectParse,
};
