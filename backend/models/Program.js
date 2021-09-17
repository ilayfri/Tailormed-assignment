const mongoose = require("mongoose");
const ProgramSchema = new mongoose.Schema({
  ProgramName: { type: String, required: true },
  TreatmentsCovered: { type: [String], required: true },
  Status: { type: String, required: true },
  MAL: { type: String, required: true },
});

module.exports = mongoose.model("Programs", ProgramSchema, "Programs");
