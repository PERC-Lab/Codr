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
          user: Schema.Types.Mixed,
          label: Schema.Types.String,
          permissions: Object
        },
      ],
    },
    labelsets: {
      type: Schema.Types.Map,
      of: {
        title: Schema.Types.String,
        labels: {
          type: [
            {
              label: Schema.Types.String,
              "sub-label": Schema.Types.String,
              color: Schema.Types.String,
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
