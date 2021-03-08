import React from "react";

const ProjectContext = React.createContext();

function ProjectReducer(state, payload) {
  // switch (payload.type) {
  //   case 'set': {
  //     return {Project: payload.data}
  //   }
  //   default: {
  //     throw new Error(`Unhandled action type: ${payload.type}`)
  //   }
  // }
  return payload;
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
    throw new Error(
      "useProject must be used within a ProjectProvider"
    );
  }
  
  // simple check to ensure Project data is available.
  if (oid && pid && (state === null || state?._id !== pid)) {
    getProject(oid, pid).then(project => setState(project));
  }

  return [state, setState];
}

/**
 * 
 * @param {String} oid Oranization Id
 * @param {String} pid Project Id
 */
const getProject = (oid, pid) => {
  return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}/project/${pid}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => res.result);
};

export { ProjectProvider, useProject };
