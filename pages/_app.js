import { Provider } from "next-auth/client";
import React from "react";
// import { ThemeProvider } from "styled-components";
import theme from "../src/theme";
import { responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

function App({ Component, pageProps }) {
  let CustomProvider = Component.Provider ? Component.Provider : React.Fragment;
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  if (CustomProvider instanceof Array) {
    // https://stackoverflow.com/a/62406732
    CustomProvider = CustomProvider.reverse().reduce(
      (GlobalProvider, NewProvider) => ({ children }) => {
        return (
          <GlobalProvider>
            <NewProvider>{children}</NewProvider>
          </GlobalProvider>
        );
      }
    );
  }

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
