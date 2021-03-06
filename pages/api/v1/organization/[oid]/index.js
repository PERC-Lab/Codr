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

export default Organizations;
