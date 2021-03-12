import React from "react";

const ProjectContext = React.createContext();

/**
 * @type {NodeJS.Timeout}
 */
// var saveTimeout = null;

function ProjectReducer(state, payload) {
  const s = { ...state };
  let sendUpdate = false;

  for (const key in payload) {
    if (s[key] !== payload[key]) {
      if (Array.isArray(payload[key])) {
        if (payload[key].length > 0) {
          for (const item in payload[key]) {
            console.log(s[key][item], payload[key][item])
            if (s[key][item] !== payload[key][item]) {
              console.log("HIT", key)
              sendUpdate = true
            };
          }
        }
      } else {
        console.log("HIT", key)
        sendUpdate = true;
      }
    }

    s[key] = payload[key];
  }

  console.log(state, sendUpdate, !state);

  // clear 5 second timeout on an edit
  if (!state) {
    return s;
  } else if (sendUpdate && state != s) {
    // Time out only should be used for onKeyUp updates.
    // if (saveTimeout) {
    //   clearTimeout(saveTimeout);
    // }

    // // save project after 5 seconds.
    // saveTimeout = setTimeout(() => {
    //   saveProject(s);
    // }, 5000);
    console.log("saving project", state != s, state !== s, state, s);

    // immediately save for onBlur events
    saveProject(s);

    // return new state to re-render page.
    return s;
  }

  // no update? Return original state to not re-render page!
  return state;
}

function ProjectProvider({ children }) {
  const [state, dispatch] = React.useReducer(ProjectReducer, null);
  return (
    <ProjectContext.Provider value={[state, dispatch]}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * @param {String} oid Organization id
 * @param {String} pid Project id
 */
function useProject(oid, pid) {
  const [state, setState] = React.useContext(ProjectContext);
  if (state === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }

  // simple check to ensure Project data is available.
  if (oid && pid && (state === null || state?._id !== pid)) {
    getProject(oid, pid).then((project) => setState(project));
  }

  return [state, setState];
}

/**
 *
 * @param {String} oid Oranization Id
 * @param {String} pid Project Id
 */
const getProject = (oid, pid) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project/${pid}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => res.result);
};

/**
 *
 * @param {{
 *   createdAt: String
 *   datasets: []
 *   guidelines: String
 *   name: String
 *   organization: String
 *   organizer: {_id: String, name: String, email: String}
 *   updatedAt: String
 *   __v: Number
 *   _id: String
 * }} project Project Data
 */
const saveProject = (project) => {
  const proj = { ...project }; // don't want to mess with important references...

  delete proj.organizer;
  delete proj.updatedAt;
  delete proj.createdAt;
  delete proj.__v;
  delete proj._id;

  return fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${project.organization}/project/${project._id}`,
    {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proj),
    }
  )
    .then((res) => res.json())
    .then((res) => res.result);
};

export { ProjectProvider, useProject };
