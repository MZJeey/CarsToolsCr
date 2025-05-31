import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/theme";
import { Layout } from "./components/Layout/Layout";
import { Outlet } from 'react-router-dom'
import { CartProvider } from "./context/CartContext";

export default function App() { 
  return ( 
    //Provider CartContext
    <CartProvider>
      <ThemeProvider theme={appTheme}> 
        <CssBaseline enableColorScheme /> 
        <Layout> 
          <Outlet /> 
        </Layout> 
      </ThemeProvider>
    </CartProvider> 
  ); 
}