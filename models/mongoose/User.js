import { Schema, models, model } from "mongoose";
import { sign } from "jsonwebtoken";

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name."],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Email cannot be blank."],
      match: [/\S+@\S+\.\S+/, "is invalid."],
      index: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateJWT = function () {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 7); // set expiration 7 days out.

  return sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    process.env.SECRET
  );
};

// exports User model.
export default models.User || model("User", UserSchema);
