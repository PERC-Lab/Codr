import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Project } from "../../../../../../models/mongoose";

/**
 * Api endpoint to get user's organizations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 */
async function ProjectsHandler(req, res) {
  const session = await getSession({ req });

  switch (req.method) {
    case "GET":
      getProjects(res, session, req.query.oid);
      break;
    case "POST":
      createProject(res, req, session);
      break;
  }
}

/**
 *
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 * @param {String} oid Project ID
 */
const getProjects = async (res, session, oid) => {
  if (session?.user) {
    Project.find({ organization: oid })
      .populate({ path: "organizer", select: "name email" })
      .exec()
      .then(projects => {
        res.status(200).json({
          status: true,
          result: projects,
        });
      })
      .catch(e => {
        res.status(500).json({
          status: false,
          result: e
        })
      })
  } else {
    res.status(401).json({
      status: false,
      result: "You do not have access to this project.",
    });
  }
};

/**
 *
 * @param {NextApiResponse} res Response
 * @param {NextApiRequest} req Request
 * @param {Session} session Session
 */
const createProject = async (res, req, session) => {
  const d = {
    name: req.body.name,
    guidelines: req.body.guidelines || "",
    organization: req.query.oid,
    organizer: session.user.id || session.user.sub,
    datasets: [],
  };

  await Project.create(d)
    .then((doc) => {
      res.status(201).json({
        status: true,
        result: doc,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        result: err,
      });
    });
};

export default ProjectsHandler;
