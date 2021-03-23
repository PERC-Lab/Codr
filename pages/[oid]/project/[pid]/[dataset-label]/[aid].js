import React, { useState } from "react";
import { ProjectLayout } from "../../../../../src/Layouts";
import { getSession } from "next-auth/client";
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
import { keys } from "lodash";
import GuidelinesModal from "../../../../../components/modals/GuidelinesModal";

const useStyles = makeStyles(theme => ({
  method: {
    width: "100%",
    padding: 0,
  },
  pre: {
    width: "100%",
    whiteSpace: "pre-wrap",
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
  let code = method.methodID;
  // highlight the portion of code before marked portion
  let start = hljs.highlight(
    method.language,
    code.slice(0, method.highlight.start),
    true
  ).value;
  // highlight the portion of code after marked portion
  let end = hljs.highlight(
    method.language,
    code.slice(method.highlight.end),
    true
  ).value;

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

const labels = {
  privacy_practice: {
    title: "Privacy Practice",
    labels: [
      {
        label: "Processing",
        color: "yellow",
      },
      {
        label: "Collection",
        color: "red",
      },
      {
        label: "Sharing",
        color: "green",
      },
    ],
  },
  purpose: {
    title: "Purpose",
    labels: [
      {
        label: "Functionality",
        "sub-label": "Authentiction",
        color: "yellow",
      },
      {
        label: "Advertisement",
        color: "red",
      },
      {
        label: "Analytics",
        "sub-label": "User Experience",
        color: "green",
      },
      {
        label: "Analytics",
        "sub-label": "Crash Analytics",
        color: "blue",
      },
    ],
  },
  information_accessed: {
    title: "Information Accessed",
    labels: ["location", "network"],
  },
};

function findLabel(option, value) {
  if (option.label === value.label) {
    if (option["sub-label"]) {
      if (option["sub-label"] === value["sub-label"]) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
}

/**
 *
 * @param {{
 *  labelList: {
 *    key: String,
 *    title: String,
 *    labels: [{
 *      label: String,
 *      "sub-label": String,
 *      color: String
 *    }]
 *  }
 * }} props Props
 * @returns {React.Component}
 */
const ChipInput = function ChipInput({ labelList }) {
  const [value, setValue] = useState([...labelList.labels]);
  const options = [...labels[labelList["key"]].labels];
  const classes = useStyles();

  return (
    <Autocomplete
      className={classes.labelInput}
      multiple
      id="tags-outlined"
      options={options}
      value={value}
      onChange={(_event, newValue) => {
        setValue(newValue);
      }}
      getOptionLabel={option => {
        return typeof option["sub-label"] !== "undefined"
          ? `${option.label} : ${option["sub-label"]}`
          : option.label;
      }}
      getOptionSelected={findLabel}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={
              typeof option["sub-label"] !== "undefined"
                ? `${option.label} : ${option["sub-label"]}`
                : option.label
            }
            style={{
              borderColor: options.find(o => findLabel(o, option)).color,
            }}
            size="small"
            {...getTagProps({ index })}
          />
        ))
      }
      filterSelectedOptions
      renderInput={params => (
        <TextField {...params} variant="outlined" label={labelList.title} />
      )}
    />
  );
};

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
  const classes = useStyles();
  const [open, setOpen] = useState(false);

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
                {keys(pageData.annotation?.data.labels).length ? (
                  keys(pageData.annotation?.data.labels).map(key =>
                    key == "information_accessed" ? null : (
                      <ChipInput
                        labelList={{
                          ...pageData.annotation?.data.labels[key],
                          key,
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
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography>
                  Navigation from one annotation to the next here
                </Typography>
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
