const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const reccommendationsSchema = new Schema(
  {
    book: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    reccommendedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reccommendedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Reccommendations = model("Reccommendations", reccommendationsSchema);

module.exports = Reccommendations;
