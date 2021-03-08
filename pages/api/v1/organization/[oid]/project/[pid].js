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
    const projects = await Project.findOne({
      _id: pid,
      organization: oid,
      // "project.datasets.userId": session.user._id
    })
      .populate({ path: "organizer", select: "name email" })
      .exec();

    res.status(200).json({
      status: true,
      result: projects,
    });
  } else {
    res.status(401).json({
      status: false,
      result: "You do not have access to this project.",
    });
  }
};

export default ProjectHandler;
