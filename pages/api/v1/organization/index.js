import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { Organization } from "models/mongoose";

/**
 * Api endpoint to get user's organizations.
 * @param {NextApiRequest} req Request
 * @param {NextApiResponse} res Response
 */
async function Organizations(req, res) {
  const session = await getSession({ req });

  if (session) {
    switch (req.method) {
      case "GET":
        getOrganizations(res, session);
        break;
      case "POST":
        createOrganization(res, session, req.body);
        break;
    }
  } else {
    res.status(401).json({
      status: false,
      result: "User is unauthorized, please log in and try again.",
    });
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
  };

  Organization.create(d)
    .then(doc => {
      res.status(201).json({
        status: true,
        result: doc,
      });
    })
    .catch(err => {
      res.status(500).json({
        status: false,
        result: err,
      });
    });
};

export default Organizations;
