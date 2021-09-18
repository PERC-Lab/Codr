import { Provider } from "next-auth/client";
import React from "react";
// import { ThemeProvider } from "styled-components";
import { light, dark } from "src/theme";
import { responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import Head from "next/head";

function App({ Component, pageProps }) {
  const OrganizationProvider = Component.OrganizationProvider
    ? Component.OrganizationProvider
    : React.Fragment;
  const ProjectProvider = Component.ProjectProvider
    ? Component.ProjectProvider
    : React.Fragment;
  const PageProvider = Component.Provider ? Component.Provider : React.Fragment;
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(() => (prefersDarkMode ? dark : light), [
    prefersDarkMode,
  ]);

  const muiTheme = responsiveFontSizes(theme);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={`/css/atom-one-${prefersDarkMode ? "dark" : "light"}.css`}
        />
      </Head>
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
    </>
  );
}

export default App;
