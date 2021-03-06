import { Provider } from "next-auth/client";
import React from "react";
// import { ThemeProvider } from "styled-components";
import theme from "../src/theme";
import { responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import { Organization } from "../src/OrganizationContext";

function App({ Component, pageProps }) {
  const CustomProvider = Component.Provider ? Component.Provider : React.Fragment;
  const Layout = Component.Layout ? Component.Layout : React.Fragment;
  // const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const muiTheme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Provider session={pageProps.session}>
        <CustomProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CustomProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
