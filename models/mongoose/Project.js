import { Schema, models, model } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your organization's name."],
    },
    organization: {
      type: String,
    },
    organizer: {
      type: String,
    },
    paricipants: {
      type: Array,
    },
    annotations: {
      type: Array,
    }
  },
  { timestamps: true }
);

// exports User model.
export default models.Project || model("Project", ProjectSchema);
