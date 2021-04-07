import { useRouter } from "next/router";
import React from "react";

const OrganizationContext = React.createContext();

function OrganizationReducer(state, payload) {
  // switch (payload.type) {
  //   case 'set': {
  //     return {Organization: payload.data}
  //   }
  //   default: {
  //     throw new Error(`Unhandled action type: ${payload.type}`)
  //   }
  // }
  const s = { ...state };

  for (const key in payload) {
    s[key] = payload[key];
  }

  return s;
}

function OrganizationProvider({ children }) {
  const [state, dispatch] = React.useReducer(OrganizationReducer, null);
  return (
    <OrganizationContext.Provider value={[state, dispatch]}>
      {children}
    </OrganizationContext.Provider>
  );
}

function useOrganization() {
  const router = useRouter()
  const { oid } = router.query;
  const [state, setState] = React.useContext(OrganizationContext);
  if (state === undefined) {
    throw new Error(
      "useOrganization must be used within a OrganizationProvider"
    );
  }

  // simple check to ensure Organization data is available (if oid is given).
  if (oid && (state === null || state?._id !== oid)) {
    getOrganization(oid).then((org) => setState(org));
  }

  return [state, setState];
}

const getOrganization = (oid) => {
  return fetch(process.env.NEXT_PUBLIC_DOMAIN + `/api/v1/organization/${oid}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => res.result);
};

export { OrganizationProvider, useOrganization };
