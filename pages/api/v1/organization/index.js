import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Organization } from "../../../../models/mongoose";

/**
 * Api endpoint to get user's organizations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 */
async function Organizations(req, res) {
  const session = await getSession({ req });

  switch (req.method) {
    case "GET":
      getOrganizations(res, session);
      break;
    case "POST":
      createOrganization(res, session, req.body);
      break;
  }
}

/**
 *
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 */
const getOrganizations = async (res, session) => {
  const orgs = await Organization.find({
    "members.email": session.user.email,
  }).exec();

  res.status(200).json({
    status: true,
    result: orgs,
  });
};

/**
 *
 * @param {NextApiResponse} res Response
 * @param {Session} session Session
 * @param {{name: String}} data User input
 */
const createOrganization = (res, session, data) => {
  console.log(data);

  const d = {
    name: data.name,
    permissions: {},
    members: [
      {
        email: session.user.email,
        role: "admin",
      },
    ],
    projects: [],
  }

  console.log(d);

  Organization.create(d)
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

export default Organizations;
