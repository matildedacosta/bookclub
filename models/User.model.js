const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "Booklover",
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Please insert a username"],
    },
    description: {
      type: String,
      default: "I am a booklover! Do you want to be my bookfriend?",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      /*  match:  */
    },
    passwordHash: {
      type: String,
      /* required: [true, "Please insert a password"], */
    },
    imageUrl: {
      type: String,
      /* default: "" */
    },
    friendsList: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bookshelf: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    favoriteBooks: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    reccommended: [{ type: Schema.Types.ObjectId, ref: "Reccommendations" }],
    whislist: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
