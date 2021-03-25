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
      required: [true, "Organization Id is required."],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Are you signed in?"],
    },
    guidelines: {
      type: Schema.Types.String,
    },
    datasets: {
      type: [
        {
          name: Schema.Types.String,
          user: Schema.Types.String,
          label: Schema.Types.String,
        },
      ],
    },
    labelsets: {
      type: Map,
      of: {
        title: String,
        labels: {
          type: [
            {
              label: String,
              "sub-label": String,
              color: String,
            },
          ],
        },
      },
    },
  },
  { timestamps: true }
);

// exports User model.
export default models.Project || model("Project", ProjectSchema);
