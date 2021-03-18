import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Annotation, Project } from "../../../../../../../models/mongoose";

/**
 * Api endpoint to get user's organizations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 */
async function DatasetHandler(req, res) {
  const session = await getSession({ req });

  switch (req.method) {
    case "GET":
      getDataset(req, res, session);
      break;
    case "POST":
      // bulkInsertAnnotations(req, res, session);
      break;
    case "PUT":
      insertAnnotation(req, res, session);
      break;
    case "DELETE":
      deleteDataset(req, res, session);
      break;
  }
}

/**
 * @description Get a dataset and their annoations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const getDataset = async (req, res, session) => {
  if (session?.user) {
    Project.findOne(
      { _id: req.query.pid },
      { datasets: { $elemMatch: { _id: req.query.did } } }
    )
      .populate({ path: "datasets.annotations" })
      .exec()
      .then(project => {
        res.status(200).json({
          status: true,
          result: project.datasets[0],
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
 * @description Inserts an annotation into a dataset.
 * @param {NextApiRequest} req Response
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const insertAnnotation = async (req, res, session) => {
  console.log(req.body);
  if (session?.user) {
    // create the annotation
    const annotation = await Annotation.create(req.body);

    // update the dataset
    const dataset = await Project.updateOne(
      // find subdocument where id, oranization, and dataset label match
      {
        _id: req.query.pid,
        organization: req.query.oid,
        "datasets.label": req.query["dataset-label"],
      },
      // push annotation into dataset
      { $push: { "datasets.$.annotations": annotation._id } }
    ).exec();

    if (dataset?.nModified === 1) {
      res.status(200).json({
        status: true,
        result: `Dataset '${req.query["dataset-label"]}' was successfully modified!`,
      });
    } else {
      res.status(400).json({
        status: false,
        result: `Dataset '${req.query["dataset-label"]}' was not able to be modified!`,
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
const deleteDataset = async (req, res, session) => {
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

export default DatasetHandler;

export const config = {
  api: {
    externalResolver: true,
  },
}