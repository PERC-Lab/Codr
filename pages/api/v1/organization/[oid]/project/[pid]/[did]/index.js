import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Annotation, Project } from "../../../../../../../../models/mongoose";
import { toInteger } from "lodash";

/**
 * Api endpoint to get user's organizations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 */
async function DatasetHandler(req, res) {
  const session = await getSession({ req });

  switch (req.method) {
    case "GET":
      // get all annotations in dataset
      getDataset(req, res, session);
      break;
    case "POST":
      if (req.query.bulk) {
        // bulk add annotations
        bulkInsertAnnotations(req, res, session);
      } else {
        // single add annotation
        insertAnnotation(req, res, session);
      }
      break;
    case "PUT":
      // update dataset
      updateDataset(req, res, session);
      break;
    case "PATCH":
      // bulk update
      bulkUpdateAnnotations(req, res, session);
      break;
    case "DELETE":
      // delete dataset: NOT DEVELOPED
      deleteDataset(req, res, session);
      break;
    default:
      res.status(500).json({
        status: false,
        result: "Unknown request.",
      });
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
    // start queries
    const query = Annotation.find({ datasetId: req.query.did });
    const count = Annotation.count({ datasetId: req.query.did });

    // modify query
    if (req.query.page) {
      query
        .limit(req.query.limit ? toInteger(req.query.limit) : 10)
        .skip(10 * toInteger(req.query.page));
    } else if (req.query.limit) {
      query.limit(toInteger(req.query.limit));
    }

    // execute query and send resolve API call.
    query
      .populate({ path: "annotated_by", select: ["email", "name"] })
      .exec()
      .then(async a => {
        const c = await count.countDocuments().exec();
        return {annotations: a, count: c};
      })
      .then(({annotations, count}) => {
        res.status(200).json({
          status: true,
          result: {
            size: count,
            annotations
          },
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
 * @description Inserts an annotation into a dataset.
 * @param {NextApiRequest} req Response
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const bulkUpdateAnnotations = async function bulkUpdateAnnotations(
  req,
  res,
  session
) {
  if (session?.user) {
    const annotations = req.body;

    const result = {
      nModified: 0,
      nFailed: 0,
      length: annotations?.length,
      error: null,
    };

    for (const a of annotations) {
      // a.datasetId = req.query.did;
      // a.project = req.query.pid;

      await Annotation.updateMany(
        {
          dataId: a.dataId,
          datasetId: req.query.did,
          project: req.query.pid,
        },
        { ...convertJsonToDot(a) }
      )
        .exec()
        .then(annotation => {
          result.nModified += annotation.nModified;
        })
        .catch(e => {
          console.log(e);
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
    // const project = await Project.updateOne(
    //   // find document where id and oranization match
    //   { _id: req.query.pid, organization: req.query.oid },
    //   // push the new dataset into project
    //   { $push: { datasets: req.body } }
    // ).exec();

    // if (project?.nModified === 1) {
    //   res.status(200).json({
    //     status: true,
    //     result: `Project '${req.query.pid}' was successfully modified!`,
    //   });
    // } else {
    //   res.status(400).json({
    //     status: false,
    //     result: `Project '${req.query.pid}' was not able to be modified!`,
    //   });
    // }
    Annotation.deleteMany({
      datasetId: req.query.did,
    })
      .exec()
      .then(d =>
        res.json({
          status: true,
          result: d,
        })
      )
      .catch(e =>
        res.json({
          status: false,
          result: e,
        })
      );
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
const updateDataset = async (req, res, session) => {
  if (session?.user) {
    if (typeof req.body === "object") {
      Project.findOneAndUpdate(
        {
          _id: req.query.pid,
          "datasets._id": req.query.did,
        },
        {
          "datasets.$": { ...req.body },
        },
        {
          returnOriginal: false,
        }
      )
        .exec()
        .then(r => {
          res.status(200).json({
            status: true,
            result: r,
            message: `Dataset '${req.query.did}' was successfully modified!`,
          });
        })
        .catch(e => {
          res.status(400).json({
            status: false,
            result: `Dataset '${req.query.did}' was not able to be modified!`,
          });
        });
    } else {
      res.status(400).json({
        status: false,
        result: {},
        message: `Dataset '${req.query.did}' was not able to be modified!`,
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

function convertJsonToDot(obj, parent = [], keyValue = {}) {
  for (let key in obj.data) {
    keyValue[`data.${key}`] = obj.data[key];
  }
  return keyValue;
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
};
