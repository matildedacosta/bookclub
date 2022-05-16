const { Schema, model } = require("mongoose");

const defaultRandomPicture = () => {
  const pictures = [
    "https://res.cloudinary.com/matildecosta/image/upload/v1652707931/bookclub/illustration-austen-by-mikel-casal-148-x-21-cm-reproduction_p5gjb5.jpg",
    "https://res.cloudinary.com/matildecosta/image/upload/v1652707931/bookclub/illustration-hemingway-by-mikel-casal-148-x-21-cms-reproduction_gbx5yf.jpg",
    "https://res.cloudinary.com/matildecosta/image/upload/v1652707931/bookclub/illustration-wolf-by-mikel-casal-148-x-21-cms-reproduction_suhhk4.jpg",
    "https://res.cloudinary.com/matildecosta/image/upload/v1652707930/bookclub/illustration-fernando-pessoa-by-mikel-casal-148-x-21-cm-reproduction_hppkca.jpg",
  ];

  return pictures[Math.floor(Math.random() * pictures.length)];
};

const randomPhoto = defaultRandomPicture();

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
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    },
    passwordHash: {
      type: String,
      required: [true, "Please insert a password"],
    },
    imageUrl: {
      type: String,
      default: randomPhoto,
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
