import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <StyledEngineProvider injectFirst>
          <StyleProvider hashPriority="high"> */}
        <App />
        {/* </StyleProvider>
        </StyledEngineProvider> */}
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
