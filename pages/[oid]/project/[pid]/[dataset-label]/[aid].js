import { ProjectLayout } from "../../../../../src/Layouts";
import { getSession } from "next-auth/client";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../../../src/ProjectContext";
import { useState } from "react";
import { useRouter } from "next/router";

export default function ProjectDatasetAnnotation({ session }) {
  const router = useRouter();
  const [org] = useOrganization();
  const [project] = useProject();
  const [pageData, setPageData] = useState({
    sent: false,
    recieved: false,
    dataset: undefined,
    annotation: undefined,
  });

  if (!pageData.sent && org && project) {
    const d = project.datasets.find(
      p => p.label == router.query["dataset-label"]
    );

    getAnnotation(org._id, project._id, d._id, router.query.aid)
      .then(a => {
        setPageData(data => ({
          ...data,
          recieved: true,
          annotation: a,
        }));
      })
      .catch(e => {
        console.error(e);
        setPageData(data => ({
          ...data,
          recieved: false,
          annotation: [],
        }));
      });
    setPageData(data => ({
      ...data,
      sent: true,
      dataset: d,
    }));
  }

  return <>{JSON.stringify(pageData)}</>;
}

/**
 * @description Get annotation data
 * @param {String} oid Organization Id
 * @param {String} pid Project Id
 * @param {String} did Dataset Id
 * @param {Strnig} aid Annotation Data Id
 * @returns {Promise}
 */
const getAnnotation = (oid, pid, did, aid) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project/${pid}/${did}/${aid}`,
    {
      method: "GET",
      credentials: "same-origin",
    }
  )
    .then(res => res.json())
    .then(res => res.result);
};

export async function getServerSideProps({ req }) {
  // Get the user's session based on the request
  const session = await getSession({ req });

  if (!session) {
    // If no user, redirect to login
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // If there is a user, return the current session
  return { props: { session } };
}

ProjectDatasetAnnotation.Layout = ProjectLayout;
ProjectDatasetAnnotation.OrganizationProvider = OrganizationProvider;
ProjectDatasetAnnotation.ProjectProvider = ProjectProvider;
