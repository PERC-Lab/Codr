import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Annotation, Project } from "../../../../../../../../models/mongoose";

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
      bulkInsertAnnotations(req, res, session);
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
    if (req.query.page) {
      Annotation.find({ datasetId: req.query.did })
        .limit(10)
        .skip(10 * req.query.page)
        .exec()
        .then(annoations => {
          res.status(200).json({
            status: true,
            result: annoations,
          });
        })
        .catch(e => {
          res.status(500).json({
            status: false,
            result: e,
          });
        });
    } else {
      Annotation.find({ datasetId: req.query.did })
        .exec()
        .then(annoations => {
          res.status(200).json({
            status: true,
            result: annoations,
          });
        })
        .catch(e => {
          res.status(500).json({
            status: false,
            result: e,
          });
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
 * @description Inserts an annotation into a dataset.
 * @param {NextApiRequest} req Response
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const insertAnnotation = async (req, res, session) => {
  if (session?.user) {
    // create the annotation
    const body = { ...req.body };
    body.datasetId = req.query.did;

    Annotation.create(body)
      .then(annotation => {
        res.status(200).json({
          status: true,
          result: `Annotation '${annotation._id}' was successfully created!`,
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
const bulkInsertAnnotations = async function bulkInsertAnnotations(
  req,
  res,
  session
) {
  if (session?.user) {
    const annotations = req.body;

    const result = {
      nCreated: 0,
      nFailed: 0,
      length: annotations?.length,
      dataset: [],
      error: null,
    };

    for (const a of annotations) {
      a.datasetId = req.query.did;
      a.project = req.query.pid;

      await Annotation.create(a)
        .then(annotation => {
          result.nCreated += 1;
          result.dataset.push(annotation._id);
        })
        .catch(e => {
          result.nFailed += 1;
          result.error = e;
        });
    }

    res.status(200).json({
      status: true,
      result,
    });

    // console.log(annotations);
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
};
