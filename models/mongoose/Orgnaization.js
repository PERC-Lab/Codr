import { Schema, models, model } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
const MemberSchma = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide the user's email address."]
    },
    role: {
      type: String,
      required: [true, "Please provide the user's assigned role."]
    }
  }
)

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
      type: [MemberSchma],
    },
  },
  { timestamps: true }
);

// exports User model.
export default models.Organization || model("Organization", OrgSchema);
