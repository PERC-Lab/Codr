import { Schema, models, model } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
const AnnotationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your organization's name."],
    },
    project: {
      type: String,
    },
    content: {
      type: String,
    },
    language: {
      type: String,
    },
    annotations: {
      type: Array,
    }
  },
  { timestamps: true }
);

// exports User model.
export default models.Annotation || model("Annotation", AnnotationSchema);
