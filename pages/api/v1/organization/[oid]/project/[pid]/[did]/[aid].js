import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Annotation, Project } from "models/mongoose";

/**
 * Api endpoint to get user's organizations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 */
async function AnnotationHandler(req, res) {
  const session = await getSession({ req });

  switch (req.method) {
    case "GET":
      getAnnotation(req, res, session);
      break;
    case "PATCH":
      updateAnnotation(req, res, session);
      break;
    case "DELETE":
      // deleteAnnotation(req, res, session);
      break;
  }
}

/**
 * @description Get a dataset and their annoations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const getAnnotation = async (req, res, session) => {
  if (session?.user) {
    const count = await Annotation.count({ datasetId: req.query.did })
      .countDocuments()
      .exec();

    try {
      const cur = await Annotation.findOne({
        _id: req.query.aid,
        datasetId: req.query.did,
      }).exec();
      const prev = await Annotation.findOne({
        _id: { $lt: req.query.aid },
        datasetId: req.query.did,
      })
        .sort({ _id: -1 })
        .exec();
      const next = await Annotation.findOne({
        _id: { $gt: req.query.aid },
        datasetId: req.query.did,
      })
        .sort({ _id: 1 })
        .exec();

      res.status(200).json({
        status: true,
        result: {
          next: next?._id,
          prev: prev?._id,
          size: count,
          annotation: cur,
        },
      });
    } catch (e) {
      res.status(500).json({
        status: false,
        result: e.message,
      });
    }
  } else {
    res.status(401).json({
      status: false,
      result: "Unauthorized Access.",
    });
  }
};

/**
 *
 * @param {NextApiRequest} req Response
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
// const deleteAnnotation = async (req, res, session) => {
//   if (session?.user) {
//     const project = await Project.updateOne(
//       // find document where id and oranization match
//       { _id: req.query.pid, organization: req.query.oid },
//       // push the new dataset into project
//       { $push: { datasets: req.body } }
//     ).exec();

//     if (project?.nModified === 1) {
//       res.status(200).json({
//         status: true,
//         result: `Project '${req.query.pid}' was successfully modified!`,
//       });
//     } else {
//       res.status(400).json({
//         status: false,
//         result: `Project '${req.query.pid}' was not able to be modified!`,
//       });
//     }
//   } else {
//     res.status(401).json({
//       status: false,
//       result: "Unauthorized Access.",
//     });
//   }
// };

/**
 *
 * @param {NextApiRequest} req Response
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const updateAnnotation = async (req, res, session) => {
  if (session?.user) {
    const annotation = await Annotation.updateOne(
      { _id: req.query.aid },
      {
        ...convertJsonToDot(req.body),
        annotated_by: session.user.sub || session.user.id,
      }
    ).exec();

    if (annotation?.nModified === 1) {
      res.status(200).json({
        status: true,
        result: `Annotation '${req.query.aid}' was successfully modified!`,
      });
    } else {
      res.status(400).json({
        status: false,
        result: `Annotation '${req.query.aid}' was not able to be modified!`,
      });
    }
  } else {
    res.status(401).json({
      status: false,
      result: "Unauthorized Access.",
    });
  }
};

export default AnnotationHandler;

function convertJsonToDot(obj, parent = [], keyValue = {}) {
  for (let key in obj.data) {
    keyValue[`data.${key}`] = obj.data[key];
  }
  return keyValue;
}

export const config = {
  api: {
    externalResolver: true,
  },
};
