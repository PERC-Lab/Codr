import { Schema, models, model } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
const ProjectSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, "Please provide your organization's name."],
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      reqired: [true, "Organization Id is required."],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      reqired: [true, "Are you signed in?"],
    },
    guidelines: {
      type: Schema.Types.String,
    },
    datasets: {
      type: [{
        name: Schema.Types.String,
        user: Schema.Types.String,
        label: Schema.Types.String,
        annotations: [{
          type: Schema.Types.ObjectId,
          ref: "Annotation",
        }]
      }],
    },
  },
  { timestamps: true }
);

// exports User model.
export default models.Project || model("Project", ProjectSchema);
