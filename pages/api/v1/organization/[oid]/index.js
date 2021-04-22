import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Organization } from "../../../../../models/mongoose";

/**
 * Api endpoint to get user's organizations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 */
async function Organizations(req, res) {
  const session = await getSession({ req });

  switch (req.method) {
    case "GET":
      getOrganization(res, session, req.query.oid);
      break;
    case "PATCH":
      updateOrganization(req, res, session);
      break;
  }
}

/**
 *
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 * @param {String} oid Organization ID
 */
const getOrganization = async (res, session, oid) => {
  if (session?.user) {
    const orgs = await Organization.findOne({
      "_id": oid,
      "members.email": session.user.email
    }).exec();

    res.status(200).json({
      status: true,
      result: orgs,
    });
  } else {
    res.status(401).json({
      status: false,
      result: "You do not have access to this organization."
    })
  }
};

/**
 *
 * @param {NextApiRequest} req Response
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const updateOrganization = async (req, res, session) => {
  if (session?.user) {
    const project = await Organization.updateOne(
      { _id: req.query.oid },
      { ...req.body }
    ).exec();

    if (project?.nModified === 1) {
      res.status(200).json({
        status: true,
        result: `Organization '${req.query.oid}' was successfully modified!`,
      });
    } else {
      res.status(400).json({
        status: false,
        result: `Organization '${req.query.oid}' was not able to be modified!`,
      });
    }
  } else {
    res.status(401).json({
      status: false,
      result: "Unauthorized Access.",
    });
  }
};

export default Organizations;
