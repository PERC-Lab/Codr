import React, { useEffect } from "react";
import { useRouter } from "next/router";

const AnnotationContext = React.createContext();

function AnnotationReducer(state, payload) {
  const s = { ...state };

  for (const key in payload) {
    s[key] = payload[key];
  }

  return s;
}

function AnnotationProvider({ children }) {
  const [state, dispatch] = React.useReducer(AnnotationReducer, null);

  const router = useRouter();
  const { oid, pid, did, aid } = router.query;

  useEffect(() => {
    // simple check to ensure Annotation data is available
    if (oid && pid && did && aid) {
      getAnnotation(oid, pid, did, aid)
        .then(a => dispatch(a))
        .catch(e => {
          console.error(e);
        });
    }
  }, [oid, pid, did, aid]);

  return (
    <AnnotationContext.Provider value={[state, dispatch]}>
      {children}
    </AnnotationContext.Provider>
  );
}

function useAnnotation() {
  const [state, setState] = React.useContext(AnnotationContext);

  if (state === undefined) {
    throw new Error("useAnnotation must be used within a AnnotationProvider");
  }

  return [state, setState];
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
  return fetch(`/api/v1/organization/${oid}/project/${pid}/${did}/${aid}`, {
    method: "GET",
    credentials: "same-origin",
  })
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
export const updateAnnotation = (oid, pid, did, aid, update) => {
  return fetch(`/api/v1/organization/${oid}/project/${pid}/${did}/${aid}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(update),
  })
    .then(res => res.json())
    .then(res => res.result);
};

export { AnnotationProvider, useAnnotation };
