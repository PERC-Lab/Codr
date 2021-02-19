import React from "react";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "../lib/useDarkMode";
import { GlobalStyles, light, dark } from "../src/Theme";

function App({ Component, pageProps }) {
  const [theme, toggleTheme, mountedComponent] = useDarkMode();
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  if (!mountedComponent) return <div />;

  return (
    <ThemeProvider theme={theme === "light" ? light : dark}>
      <GlobalStyles />
      <Layout darkMode={[theme, toggleTheme]}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
