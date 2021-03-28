import { Schema, models, model } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
const OrgSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your organization's name."],
    },
    permissions: {
      type: JSON,
    },
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

// exports User model.
export default models.Organization || model("Organization", OrgSchema);
