import { OrgLayout } from "../../src/Layouts";
import { getSession } from "next-auth/client";
import { Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import {
  OrganizationProvider,
  useOrganization,
} from "../../src/OrganizationContext";
import { useState } from "react";

export default function Organization({ session }) {
  const [org, dispatch] = useOrganization();
  const [status, setStatus] = useState({
    sent: false,
    recieved: false,
  });
  const router = useRouter();

  // simple statement to check if org is already initialized.
  if (!status.sent && !org) {
    getOrganization(router.query.orgId)
      .then((org) => {
        dispatch({ type: "set", payload: org });
        setStatus(({ sent }) => {
          return { sent, recieved: true };
        });
      })
      .catch((e) => console.error(e));
    setStatus(({ recieved }) => {
      return { sent: true, recieved };
    });
  }

  return <Typography>Welcome{org?.name ? `, ${org.name}` : ''}!</Typography>;
}

const getOrganization = (oid) => {
  return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/organization/${oid}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => res.result);
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

Organization.Layout = OrgLayout;
Organization.Provider = OrganizationProvider;
