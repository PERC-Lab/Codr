import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Project } from "../../../../../../models/mongoose";

/**
 * Api endpoint to get user's organizations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 */
async function ProjectHandler(req, res) {
  const session = await getSession({ req });

  switch (req.method) {
    case "GET":
      getProject(res, session, req.query.oid, req.query.pid);
      break;
    case "PATCH":
      updateProject(req, res, session);
      break;
    case "PUT":
      insertDataset(req, res, session);
      break;
    case "DELETE":
      deleteProject(req, res, session);
      break;
  }
}

/**
 *
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 * @param {String} oid Project ID
 * @param {String} pid Project ID
 */
const getProject = async (res, session, oid, pid) => {
  if (session?.user) {
    const project = await Project.findOne({
      _id: pid,
      organization: oid,
      // "project.datasets.user": session.user._id
    })
      .populate({ path: "organizer", select: "name email" })
      .exec();

    res.status(200).json({
      status: true,
      result: project,
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
const updateProject = async (req, res, session) => {
  if (session?.user) {
    const project = await Project.updateOne(
      { _id: req.query.pid, organization: req.query.oid },
      { ...req.body }
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

/**
 *
 * @param {NextApiRequest} req Response
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const insertDataset = async (req, res, session) => {
  if (session?.user) {
    const project = await Project.updateOne(
      // find document where id and oranization match
      { _id: req.query.pid, organization: req.query.oid },
      // push the new dataset into project
      { $push: { datasets: { ...req.body } } }
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

/**
 *
 * @param {NextApiRequest} req Response
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const deleteProject = async (req, res, session) => {
  if (session?.user) {
    const project = await Project.deleteOne({
      _id: req.query.pid,
      organization: req.query.oid,
    }).exec();

    if (project?.deletedCount === 1) {
      res.status(200).json({
        status: true,
        result: `Project '${req.query.pid}' was successfully deleted!`,
      });
    } else {
      res.status(400).json({
        status: false,
        result: `Project '${req.query.pid}' was not able to be deleted!`,
      });
    }
  } else {
    res.status(401).json({
      status: false,
      result: "Unauthorized Access.",
    });
  }
};

export default ProjectHandler;
