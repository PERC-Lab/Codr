import { Schema, models, model } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
const AnnotationSchema = new Schema(
  {
    datasetId: {
      type: Schema.Types.ObjectId,
      ref: "Project.datasets",
      required: [true, "Dataset Id is required."],
    },
    dataId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    data: {
      type: {
        methods: {
          type: [
            {
              methodId: String,
              highlight: {
                type: {
                  start: Number,
                  end: Number,
                  color: String,
                },
              },
            },
          ],
        },
        language: String,
        labels: {
          type: Map,
          of: [
            {
              label: String,
              "sub-label": String,
            },
          ],
        },
      },
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project Id is required."],
    },
    verified_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    annotated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// exports User model.
export default models.Annotation || model("Annotation", AnnotationSchema);
