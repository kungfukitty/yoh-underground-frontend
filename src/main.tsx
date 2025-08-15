import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import AuthProvider from "@/providers/AuthProvider";
import UserDocProvider from "@/providers/UserDocProvider";
import Toaster from "@/providers/Toaster";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserDocProvider>
          <Toaster />
          <App />
        </UserDocProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
