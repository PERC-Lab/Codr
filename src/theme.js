import { blue, orange } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// Create a light theme instance.
const light = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: blue[500],
    },
    secondary: {
      main: orange[500],
    },
    background: {
      default: "#e8e8e8",
    },
    text: {
      primary: "rgba(0,0,0,0.8)",
    },
  },
});

// Create a dark theme instance.
const dark = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: blue[500],
    },
    secondary: {
      main: orange[500],
    },
    background: {
      default: "#121212",
    },
    text: {
      primary: "rgba(255,255,255,0.8)",
    },
  },
});

/**
 * Expose themes
 */
export { dark, light };

/**
 * Light Theme
 */
export default light;
