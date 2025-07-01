const mongo = require("mongoose");

const postSchema = new mongo.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_by: { type: String, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

module.exports = mongo.model("Post", postSchema);
