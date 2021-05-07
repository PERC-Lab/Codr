import { ProjectLayout } from "../../../../../src/Layouts";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../../../src/ProjectContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PaginationTable from "../../../../../src/components/DatasetPaginationTable";

const headCells = [
  { id: "dataId", numeric: false, disablePadding: true, label: "Data Id" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" },
  { id: "action", numeric: true, disablePadding: false, label: "Action" },
];
export default function ProjectDataset() {
  const router = useRouter();
  const [org] = useOrganization();
  const [project, setProject] = useProject();
  const [pageData, setPageData] = useState({
    sent: false,
    recieved: false,
    page: 0,
    pageSize: 10,
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

    getAnnotations(
      org._id,
      project._id,
      d._id,
      pageData.page,
      pageData.pageSize
    )
      .then(a => {
        console.log(a);
        setPageData(data => ({
          ...data,
          recieved: true,
          datasetSize: a.size,
          annotations: a.annotations,
        }));
        setProject({
          datasetAnnotations: a.annotations.map(anno => anno._id),
          disableSave: true,
        });
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

  useEffect(() => {
    if (project && org) {
      const d = project.datasets.find(
        p => p.label == router.query["dataset-label"]
      );

      getAnnotations(
        org._id,
        project._id,
        d._id,
        pageData.page,
        pageData.pageSize
      )
        .then(a => {
          console.log(a);
          setPageData(data => ({
            ...data,
            recieved: true,
            datasetSize: a.size,
            annotations: a.annotations,
          }));
          setProject({
            datasetAnnotations: a.annotations.map(anno => anno._id),
            disableSave: true,
          });
        })
        .catch(e => {
          console.error(e);
          setPageData(data => ({
            ...data,
            recieved: false,
            annotations: [],
          }));
        });
    }
  }, [pageData.pageSize, pageData.page]);

  return pageData.annotations?.length >= 0 ? (
    <PaginationTable
      title={`${pageData.dataset.name}: Annotations`}
      rows={pageData.annotations}
      size={pageData.datasetSize}
      headerCells={headCells}
      onPageUpdate={p => {
        setPageData(data => ({
          ...data,
          page: p,
        }));
      }}
      onPageSizeUpdate={p => {
        setPageData(data => ({
          ...data,
          pageSize: p,
        }));
      }}
    />
  ) : null;
}

const getAnnotations = (oid, pid, did, page, limit) => {
  return fetch(
    `/api/v1/organization/${oid}/project/${pid}/${did}?page=${page}&limit=${limit}`,
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
