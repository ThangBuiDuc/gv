import "./App.css";
import React, { Suspense } from "react";
import {
  Routes,
  Route,
  Outlet,
  Navigate,
  // useLocation,
  // useNavigate,
} from "react-router-dom";
import ReactLoading from "react-loading";
import Header from "./hardComponent/header";
import Footer from "./hardComponent/footer";
import SideBar from "./hardComponent/sidebar/index";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  // RedirectToSignIn,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

// import Init from "./component/survey/init";

import SignIn from "./hardComponent/signIn";
// import SignUp from './hardComponent/signUp'

const HomePage = React.lazy(() => import("./component/homePage"));
const Init = React.lazy(() => import("./component/survey/init"));
const Approve = React.lazy(()=> import("./component/survey/approve"))

function Hard() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex pl-[15px] pr-[15px] mt-[40px] gap-[2%] flex-row-reverse">
        <SideBar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function Clerk() {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route
          path="/sign-in"
          element={
            <>
              <SignedIn>
                <Navigate to="/home" replace />
              </SignedIn>
              <SignedOut>
                <SignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="/" element={<Hard />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route
            path="/home"
            element={
              <Suspense
                fallback={
                  <div className="ml-[20px] mt-[20px]">
                    <ReactLoading
                      type="spin"
                      color="#0083C2"
                      width={"50px"}
                      height={"50px"}
                    />
                  </div>
                }
              >
                <HomePage />
              </Suspense>
            }
          />

          <Route
            path="/survey"
            element={<Navigate to="/survey/init" replace />}
          />
          <Route
            path="/survey/init"
            element={
              <>
                <SignedIn>
                  <Suspense
                    fallback={
                      <div className="ml-[20px] mt-[20px]">
                        <ReactLoading
                          type="spin"
                          color="#0083C2"
                          width={"50px"}
                          height={"50px"}
                        />
                      </div>
                    }
                  >
                    <Init />
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  {/* <RedirectToSignIn /> */}
                  <Navigate to="/sign-in" />
                </SignedOut>
              </>
            }
          />

<Route
            path="/survey/approve"
            element={
              <>
                <SignedIn>
                  <Suspense
                    fallback={
                      <div className="ml-[20px] mt-[20px]">
                        <ReactLoading
                          type="spin"
                          color="#0083C2"
                          width={"50px"}
                          height={"50px"}
                        />
                      </div>
                    }
                  >
                    <Approve />
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  {/* <RedirectToSignIn /> */}
                  <Navigate to="/sign-in" />
                </SignedOut>
              </>
            }
          />
        </Route>
      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return <Clerk />;
}

export default App;
