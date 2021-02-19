import { useLayoutEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState(null);

  useLayoutEffect(() => {
    const localUser = window.localStorage.getItem("user");
    localUser && setUser(localUser);
  }, []);

  return [user, setUser];
};
