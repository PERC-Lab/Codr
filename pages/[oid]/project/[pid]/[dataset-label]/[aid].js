import React, { useEffect, useState } from "react";
import { ProjectLayout } from "../../../../../src/Layouts";
import {
  OrganizationProvider,
  useOrganization,
} from "../../../../../src/OrganizationContext";
import { ProjectProvider, useProject } from "../../../../../src/ProjectContext";
import { useRouter } from "next/router";
import hljs from "highlight.js";
import { Autocomplete, Skeleton } from "@material-ui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { keys, isEqual } from "lodash";
import GuidelinesModal from "../../../../../components/modals/GuidelinesModal";
import Navigator from "../../../../../lib/navigator";

const useStyles = makeStyles(theme => ({
  method: {
    width: "100%",
    padding: 0,
  },
  pre: {
    width: "100%",
    whiteSpace: "pre-wrap",
    fontSize: "1rem",
    overflowWrap: "anywhere",
    margin: 0,
    "&, span": {
      whiteSpace: "pre-wrap",
    },
  },
  labelCard: {
    position: "sticky",
    top: 88,
    "& > div": {
      marginBottom: theme.spacing(2),
    },
  },
  labelInput: {
    "& + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

/**
 *
 * @param {{
 *  methodID: String,
 *  language: String,
 *  highlight: {
 *    start: Number,
 *    end: Number,
 *    color: String,
 *  }
 * }} method Method
 * @returns
 */
const Highlighter = function Highlighter(method, classes) {
  // get code segment
  let code = method.methodID || method.src_code;
  // highlight the portion of code before marked portion
  let start = hljs.highlight(code.slice(0, method.highlight.start), {
    language: method.language,
    ignoreIllegals: true,
  }).value;
  // highlight the portion of code after marked portion
  let end = hljs.highlight(code.slice(method.highlight.end), {
    language: method.language,
    ignoreIllegals: true,
  }).value;

  // set the inner html of the HTML code tag to the highlighted code.
  return (
    <pre className={[`hljs lang-${method.language} ${classes.pre}`]}>
      <code
        dangerouslySetInnerHTML={{
          __html: `${start}<mark style='background-color: ${
            method.highlight.color
          };'>${code.slice(
            method.highlight.start,
            method.highlight.end
          )}</mark>${end}`,
        }}
      />
    </pre>
  );
};

function findLabel(option, value) {
  // capture only label and sub-label for matching.
  const o = {
    label: option.label,
    "sub-label": option["sub-label"] || null,
  };
  const v = {
    label: value.label,
    "sub-label": value["sub-label"] || null,
  };

  // return if they're equal
  return isEqual(o, v);
}

/**
 *
 * @param {{
 *  labelList: [{
 *    label: String,
 *    "sub-label": String
 *  }]
 *  options: {
 *    label: String,
 *    "sub-label": String,
 *    color: String
 *  }[]
 *  labelsetName: String
 *  onChange: Function
 * }} props Props
 * @returns {React.Component}
 */
const ChipInput = function ChipInput({
  labelList,
  options,
  labelsetName,
  onChange,
}) {
  const [value, setValue] = useState([...labelList]);
  const classes = useStyles();

  // fix default value issue
  useEffect(() => {
    setValue(labelList);
  }, [labelList]);

  return (
    <Autocomplete
      className={classes.labelInput}
      multiple
      id="tags-outlined"
      options={options}
      value={value}
      onChange={(_event, newValue) => {
        const val = newValue.map(v => ({
          label: v.label,
          "sub-label": v["sub-label"],
        }));
        onChange(val);
        setValue(val);
      }}
      getOptionLabel={option => {
        return typeof option["sub-label"] !== "undefined" &&
          !!option["sub-label"]
          ? `${option.label} : ${option["sub-label"]}`
          : option.label;
      }}
      getOptionSelected={findLabel}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={
              typeof option["sub-label"] !== "undefined" &&
              !!option["sub-label"]
                ? `${option.label} : ${option["sub-label"]}`
                : option.label
            }
            style={{
              backgroundColor: options.find(o => findLabel(o, option))?.color,
            }}
            size="small"
            {...getTagProps({ index })}
          />
        ))
      }
      filterSelectedOptions
      renderInput={params => (
        <TextField {...params} variant="outlined" label={labelsetName} />
      )}
    />
  );
};

export default function ProjectDatasetAnnotation() {
  const router = useRouter();
  const [org] = useOrganization();
  const [project] = useProject();
  const [pageData, setPageData] = useState({
    sent: false,
    recieved: false,
    dataset: undefined,
    annotation: undefined,
  });
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  var myNav;

  if (project?.datasetAnnotations && !myNav)
    myNav = new Navigator(project.datasetAnnotations, router.query.aid);

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
        }));
      });
    setPageData(data => ({
      ...data,
      sent: true,
      dataset: d,
    }));
  }

  // if annotation id in url changes, fetch new annotation data.
  useEffect(() => {
    if (org && project) {
      setPageData(data => ({
        ...data,
        recieved: false,
        annotation: null,
      }));

      getAnnotation(
        org._id,
        project._id,
        pageData.dataset._id,
        router.query.aid
      )
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
    }
  }, [router.query.aid]);

  return (
    <>
      <GuidelinesModal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {project?.guidelines}
      </GuidelinesModal>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          {pageData?.annotation?.data?.methods ? (
            pageData.annotation.data.methods.map((method, index) => {
              method.language = pageData.annotation.data.language;
              return (
                <Accordion key={`method-${index}`}>
                  <AccordionSummary>{`Method ${index + 1}`}</AccordionSummary>
                  <AccordionDetails className={classes.method}>
                    {Highlighter(method, classes)}
                  </AccordionDetails>
                </Accordion>
              );
            })
          ) : (
            <>
              <Skeleton height={100}></Skeleton>
              <Skeleton height={70}></Skeleton>
              <Skeleton height={125}></Skeleton>
            </>
          )}
        </Grid>
        <Grid item xs={4}>
          <div className={classes.labelCard}>
            <Card>
              <CardHeader
                title="Guidelines"
                action={
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    View
                  </Button>
                }
              />
            </Card>
            <Card>
              <CardHeader title="Labels" />
              <CardContent>
                {keys(project?.labelsets).length ? (
                  keys(project.labelsets).map(key =>
                    key == "information_accessed" ? null : (
                      <ChipInput
                        labelList={
                          pageData.annotation?.data?.labels &&
                          pageData.annotation.data.labels[key]
                            ? pageData.annotation?.data.labels[key]
                            : []
                        }
                        options={project?.labelsets[key].labels}
                        labelsetName={project?.labelsets[key].title}
                        onChange={labels => {
                          const d = {
                            data: {
                              labels: { ...pageData.annotation.data.labels },
                            },
                          };
                          d.data.labels[key] = labels;
                          updateAnnotation(
                            org._id,
                            project._id,
                            pageData.dataset._id,
                            router.query.aid,
                            d
                          );
                        }}
                        key={key}
                      />
                    )
                  )
                ) : (
                  <>
                    <Skeleton height={64} />
                    <Skeleton height={64} />
                  </>
                )}
                {pageData.recieved ? (
                  <TextField
                    variant="outlined"
                    label="Comments"
                    fullWidth
                    multiline
                    defaultValue={pageData.annotation.data?.comments}
                    onBlur={e => {
                      updateAnnotation(
                        org._id,
                        project._id,
                        pageData.dataset._id,
                        router.query.aid,
                        {
                          data: {
                            comments: e.target.value,
                          },
                        }
                      );
                    }}
                  />
                ) : (
                  <Skeleton height={64} />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Button
                  color="primary"
                  disabled={!myNav?.hasPrev()}
                  onClick={() => {
                    const oid = router.query.oid,
                      pid = router.query.pid,
                      ds = router.query["dataset-label"],
                      aid = myNav.getPrev();
                    router.push(`/${oid}/project/${pid}/${ds}/${aid}`);
                  }}
                >
                  Prev
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!myNav?.hasNext()}
                  onClick={() => {
                    const oid = router.query.oid,
                      pid = router.query.pid,
                      ds = router.query["dataset-label"],
                      aid = myNav.getNext();
                    router.push(`/${oid}/project/${pid}/${ds}/${aid}`);
                  }}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </>
  );
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

/**
 * @description Get annotation data
 * @param {string} oid Organization Id
 * @param {string} pid Project Id
 * @param {string} did Dataset Id
 * @param {string} aid Annotation Data Id
 * @param {{
 *  data: {
 *    labels: Object.<string, {label: string, "sub-label": string}[]>
 *    comment: string
 *  }
 * }} update Data to update
 * @returns {Promise}
 */
const updateAnnotation = (oid, pid, did, aid, update) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project/${pid}/${did}/${aid}`,
    {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    }
  )
    .then(res => res.json())
    .then(res => res.result);
};

ProjectDatasetAnnotation.Layout = ProjectLayout;
ProjectDatasetAnnotation.OrganizationProvider = OrganizationProvider;
ProjectDatasetAnnotation.ProjectProvider = ProjectProvider;
