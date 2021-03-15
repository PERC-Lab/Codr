import { Provider } from "next-auth/client";
import React from "react";
// import { ThemeProvider } from "styled-components";
import theme from "../src/theme";
import { responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

function App({ Component, pageProps }) {
  const OrganizationProvider = Component.OrganizationProvider
    ? Component.OrganizationProvider
    : React.Fragment;
  const ProjectProvider = Component.ProjectProvider
    ? Component.ProjectProvider
    : React.Fragment;
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  const muiTheme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Provider session={pageProps.session}>
        <OrganizationProvider>
          <ProjectProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ProjectProvider>
        </OrganizationProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
