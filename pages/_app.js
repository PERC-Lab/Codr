import { Provider } from "next-auth/client";
import React from "react";
// import { ThemeProvider } from "styled-components";
// import theme from '../src/theme';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, useMediaQuery } from "@material-ui/core";

function App({ Component, pageProps }) {
  const Layout = Component.Layout ? Component.Layout : React.Fragment;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      responsiveFontSizes(
        createMuiTheme({
          palette: {
            type: prefersDarkMode ? 'dark' : 'light',
            background: {
              default: '#121212',
            },
          },
        })
      ),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
