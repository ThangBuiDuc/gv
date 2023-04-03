import "./App.css";
import React, {
  Suspense,
  useLayoutEffect,
  useState,
  createContext,
} from "react";
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
  useAuth,
  // RedirectToSignIn,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

// import Init from "./component/survey/init";

import SignIn from "./hardComponent/signIn";
// import SignUp from './hardComponent/signUp'

const HomePage = React.lazy(() => import("./component/homePage"));
const Init = React.lazy(() => import("./component/survey/init"));
const Approve = React.lazy(() => import("./component/survey/approve"));
const Question = React.lazy(() => import("./component/survey/question"));
const Infor = React.lazy(() => import("./component/survey-gv/infor"));
const Partner = React.lazy(() => import("./component/survey-gv/partner"));
const Assign = React.lazy(() => import("./component/survey-gv/assign"));
const QLDTSV = React.lazy(() => import("./component/qldt/sv"));
const QLDTGV = React.lazy(() => import("./component/qldt/gv"));

export const RoleContext = createContext();

function PreventRole() {
  const { isSignedIn, getToken } = useAuth();
  const [role, setRole] = useState(null);
  useLayoutEffect(() => {
    const callApi = async () => {
      if (isSignedIn) {
        await fetch(`${import.meta.env.VITE_ROLE_API}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_ROLE,
            })}`,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.result) setRole(res.result[0]);
          })
          .catch(() => {
            setRole({role_id:0});
          });
      }
      else setRole({role_id:0})
    };

    callApi();
  }, [isSignedIn]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
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
        <Route path="/" element={<Hard role={role} />}>
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
                    {import.meta.env.VITE_ROLE_ADMIN.split("||").find(
                      (item) => item === role?.role_id.toString()
                    ) ? (
                      <Init />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
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
                    {import.meta.env.VITE_ROLE_ADMIN.split("||").find(
                      (item) => item === role?.role_id.toString()
                    ) ? (
                      <Approve />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
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
            path="/survey/question"
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
                    {import.meta.env.VITE_ROLE_ADMIN.split("||").find(
                      (item) => item === role?.role_id.toString()
                    ) ? (
                      <Question />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
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
            path="/survey-gv"
            element={<Navigate to="/survey-gv/infor" replace />}
          />
          <Route
            path="/survey-gv/infor"
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
                    <Infor />
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
            path="/survey-gv/partner"
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
                    <Partner />
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
            path="/survey-gv/assign"
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
                    <Assign />
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
            path="/qldt/sv"
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
                    {import.meta.env.VITE_ROLE_ADMIN.split("||").find(
                      (item) => item === role?.role_id.toString()
                    ) ? (
                      <QLDTSV />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
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
            path="/qldt/gv"
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
                    {import.meta.env.VITE_ROLE_ADMIN.split("||").find(
                      (item) => item === role?.role_id.toString()
                    ) ? (
                      <QLDTGV />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
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
    </RoleContext.Provider>
  );
}

function Hard({ role }) {
  // console.log(location.pathname)
  if (location.pathname === "/home") {
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
  } else if (role || role?.role_id === 0) {
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
  } else
    return (
      <LoadingBar
        progress={100}
        color="#0083C2"
        height={5}
        waitingTime={1000000}
      />
    );
}

function Clerk() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <PreventRole />
    </ClerkProvider>
  );
}

function App() {
  return <Clerk />;
}

export default App;
