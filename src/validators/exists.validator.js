/**
 * Custom validator
 * @param {Mongoose.Model} model
 * @param {string} field.
 */
module.exports = function checkExist(model, field) {
  return async function (value) {
    const query = {};
    query[field] = value;

    const record = await model.findOne(query);
    if (record) {
      throw new Error(`${field} đã tồn tại`);
    }

    return true;
  };
};
