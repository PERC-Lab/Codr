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
      type: Schema.Types.String,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
    },
    data: {
      type: {
        methods: {
          type: [
            {
              method_id: Schema.Types.String,
              src_code: Schema.Types.String,
              highlight: {
                type: {
                  start: Schema.Types.String,
                  end: Schema.Types.Number,
                  color: Schema.Types.String,
                },
              },
            },
          ],
        },
        language: Schema.Types.String,
        labelsets: {
          type: Schema.Types.Map,
          of: [
            {
              label: Schema.Types.String,
              "sub-label": Schema.Types.String,
            },
          ],
        },
        comment: Schema.Types.String
      },
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project Id is required."],
    },
    verified_by: {
      type: Schema.Types.String,
      ref: "User",
    },
    annotated_by: {
      type: Schema.Types.String,
      ref: "User",
    },
  },
  { timestamps: true }
);

// exports User model.
export default models.Annotation || model("Annotation", AnnotationSchema);
