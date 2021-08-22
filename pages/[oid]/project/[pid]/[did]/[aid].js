import React, { useEffect, useState } from "react";
import { ProjectLayout } from "src/Layouts";
import { OrganizationProvider, useOrganization } from "src/OrganizationContext";
import {
  AnnotationProvider,
  updateAnnotation,
  useAnnotation,
} from "src/AnnotationContext";
import { ProjectProvider, useProject } from "src/ProjectContext";
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
} from "@material-ui/core";
import { keys, isEqual } from "lodash";
import GuidelinesModal from "src/components/modals/GuidelinesModal";
import { useNavigator } from "lib/navigator";
import AccessControlManager from "lib/abac";
import { useSession } from "next-auth/client";

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
  disabled,
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
      disabled={disabled}
      multiple
      id={`${labelsetName}-input`}
      options={options}
      value={value}
      onChange={(event, newValue) => {
        event.preventDefault();
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
  const [data, setData] = useAnnotation();
  const [project] = useProject();
  const [session] = useSession();
  const [saving, setSaving] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const myNav = useNavigator();

  console.log(data);

  const getDataset = () => {
    if (project) {
      return project?.datasets?.find(p => p?._id === router.query?.did);
    }
    return undefined;
  };

  /**
   * @type {[AccessControlManager, function]}
   */
  const [ACL, setACL] = useState();

  useEffect(() => {
    if (project) {
      project?.datasets?.find(p => p?._id === router.query?.did);
    }
  }, [project]);

  useEffect(() => {
    if (getDataset()?.permissions) {
      setACL(() => {
        const ac = new AccessControlManager({
          grants: getDataset()?.permissions,
          enabled: getDataset()?.permissionsEnabled,
        });
        ac?.setRole(org.members.find(m => m.email === session.user.email).role);
        return ac;
      });
    }
  }, [getDataset()?.permissions]);

  console.log(ACL);

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
          {data?.annotation?.data?.methods ? (
            data.annotation.data.methods.map((method, index) => {
              method.language = data.annotation.data.language;
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
                {keys(project?.labelsets).length && data?.annotation ? (
                  keys(project.labelsets).map(key =>
                    key == "information_accessed" ? null : (
                      <ChipInput
                        labelList={
                          data.annotation.data.labels &&
                          data.annotation.data.labels[key]
                            ? data.annotation.data.labels[key]
                            : []
                        }
                        disabled={(function () {
                          try {
                            return ACL.enabled
                              ? !ACL?.canUser()
                                  .execute("update")
                                  .sync()
                                  .on("annotation").granted
                              : false;
                          } catch (e) {
                            return true;
                          }
                        })()}
                        options={project?.labelsets[key].labels}
                        labelsetName={project?.labelsets[key].title}
                        onChange={labels => {
                          // capture update to send to db
                          const d = {
                            data: {
                              labels: { ...data.annotation.data.labels },
                            },
                          };
                          d.data.labels[key] = labels;

                          // also save to the local "data" to fix de-sync error
                          const a = { ...data.annotation };
                          a.data.labels[key] = labels;
                          setData({ annotation: a });

                          // set to true, to wait for save function to finish
                          setSaving(true);

                          // send off data to be saved.
                          updateAnnotation(
                            org._id,
                            project._id,
                            getDataset()._id,
                            router.query.aid,
                            d
                          ).then(() => {
                            setSaving(false);
                          });
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
                {data?.annotation ? (
                  <TextField
                    variant="outlined"
                    label="Comments"
                    fullWidth
                    multiline
                    InputLabelProps={{
                      shrink: !!data.annotation.data?.comments,
                    }}
                    disabled={(function () {
                      try {
                        return ACL.enabled
                          ? !ACL?.canUser()
                              .execute("update")
                              .sync()
                              .on("annotation").granted
                          : false;
                      } catch (e) {
                        return true;
                      }
                    })()}
                    value={
                      data.annotation.data?.comments
                        ? data.annotation.data.comments
                        : ""
                    }
                    onChange={e => {
                      // update local "data" to fix potential de-sync error
                      const a = { ...data.annotation };
                      a.data.comments = e.target.value;
                      setData({ annotation: a });
                    }}
                    onBlur={e => {
                      // wait for save
                      setSaving(true);

                      // send off save
                      updateAnnotation(
                        org._id,
                        project._id,
                        getDataset()._id,
                        router.query.aid,
                        {
                          data: {
                            comments: e.target.value,
                          },
                        }
                      ).then(() => {
                        setSaving(false);
                      });
                    }}
                  />
                ) : (
                  <Skeleton height={64} />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={6}
                    style={{ alignItems: "center", display: "flex" }}
                  >
                    ?? of {myNav ? myNav.size : 0}
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Button
                          color="primary"
                          disabled={!myNav?.hasPrev()}
                          onClick={() => {
                            const { oid, pid, did: ds } = router.query,
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
                            const { oid, pid, did: ds } = router.query,
                              aid = myNav.getNext();
                            router.push(`/${oid}/project/${pid}/${ds}/${aid}`);
                          }}
                        >
                          Next
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

ProjectDatasetAnnotation.Layout = ProjectLayout;
ProjectDatasetAnnotation.OrganizationProvider = OrganizationProvider;
ProjectDatasetAnnotation.ProjectProvider = ProjectProvider;
ProjectDatasetAnnotation.Provider = AnnotationProvider;
