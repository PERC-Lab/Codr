import { Provider } from "next-auth/client";
import React from "react";
// import { ThemeProvider } from "styled-components";
import theme from "src/theme";
import { responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import "highlight.js/styles/atom-one-dark.css";

function App({ Component, pageProps }) {
  const OrganizationProvider = Component.OrganizationProvider
    ? Component.OrganizationProvider
    : React.Fragment;
  const ProjectProvider = Component.ProjectProvider
    ? Component.ProjectProvider
    : React.Fragment;
  const PageProvider = Component.Provider ? Component.Provider : React.Fragment;
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  const muiTheme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Provider session={pageProps.session}>
        <OrganizationProvider>
          <ProjectProvider>
            <PageProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </PageProvider>
          </ProjectProvider>
        </OrganizationProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
