import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Annotation, Project } from "../../../../../../../../models/mongoose";

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
    case "DELETE":
      deleteAnnotation(req, res, session);
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
    Annotation.findOne({ _id: req.query.aid })
      .exec()
      .then(annoation => {
        res.status(200).json({
          status: true,
          result: annoation,
        });
      })
      .catch(e => {
        res.status(500).json({
          status: false,
          result: e,
        });
      });
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
const deleteAnnotation = async (req, res, session) => {
  if (session?.user) {
    const project = await Project.updateOne(
      // find document where id and oranization match
      { _id: req.query.pid, organization: req.query.oid },
      // push the new dataset into project
      { $push: { datasets: req.body } }
    ).exec();

    if (project?.nModified === 1) {
      res.status(200).json({
        status: true,
        result: `Project '${req.query.pid}' was successfully modified!`,
      });
    } else {
      res.status(400).json({
        status: false,
        result: `Project '${req.query.pid}' was not able to be modified!`,
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

export const config = {
  api: {
    externalResolver: true,
  },
};