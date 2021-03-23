import { ProjectLayout } from "../../../../../src/Layouts";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../../../src/ProjectContext";
import { useState } from "react";
import { useRouter } from "next/router";
import PaginationTable from "../../../../../components/PaginationTable";

const headCells = [
  { id: "dataId", numeric: false, disablePadding: true, label: "Data Id" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" },
  { id: "action", numeric: true, disablePadding: false, label: "Action" },
];
export default function ProjectDataset() {
  const router = useRouter();
  const [org] = useOrganization();
  const [project] = useProject();
  const [pageData, setPageData] = useState({
    sent: false,
    recieved: false,
    page: 0,
    dataset: undefined,
    annotations: undefined,
  });

  if (
    (!pageData.sent ||
      pageData.dataset?.label !== router.query["dataset-label"]) &&
    org &&
    project
  ) {
    const d = project.datasets.find(
      p => p.label == router.query["dataset-label"]
    );

    getAnnotations(org._id, project._id, d._id, pageData.page)
      .then(a => {
        setPageData(data => ({
          ...data,
          recieved: true,
          annotations: a,
        }));
      })
      .catch(e => {
        console.error(e);
        setPageData(data => ({
          ...data,
          recieved: false,
          annotations: [],
        }));
      });
    setPageData(data => ({
      ...data,
      sent: true,
      dataset: d,
    }));
  }

  return pageData.annotations?.length >= 0 ? (
    <PaginationTable
      title={`${pageData.dataset.name}: Annotations`}
      rows={pageData.annotations}
      headerCells={headCells}
      pageSize={10}
      onPageUpdate={p => {
        setPageData(data => ({
          ...data,
          page: p,
        }));
      }}
    />
  ) : null;
}

const getAnnotations = (oid, pid, did, page) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project/${pid}/${did}?page=${page}`,
    {
      method: "GET",
      credentials: "same-origin",
    }
  )
    .then(res => res.json())
    .then(res => res.result);
};

ProjectDataset.Layout = ProjectLayout;
ProjectDataset.OrganizationProvider = OrganizationProvider;
ProjectDataset.ProjectProvider = ProjectProvider;
