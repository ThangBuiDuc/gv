import "./App.css";
import React, {
  Suspense,
  useLayoutEffect,
  useState,
  createContext,
  useEffect,
} from "react";
import {
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
  // useLocation,
  // useNavigate,
} from "react-router-dom";
import ReactLoading from "react-loading";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { useTransition, animated } from "react-spring";
import TopBarProgress from "react-topbar-progress-indicator";
TopBarProgress.config({
  barColors: {
    0: "#0083C2",
    "1.0": "#0083C2",
  },
  shadowBlur: 5,
  barThickness: 5,
});

// ADMIN IMPORT
import HeaderAdmin from "./admin/hardComponent/header";
import SideBarAdmin from "./admin/hardComponent/sideBar";

// ADMIN SURVEY IMPORT
const Init = React.lazy(() => import("./admin/component/survey/init"));
const Approve = React.lazy(() => import("./admin/component/survey/approve"));
const Question = React.lazy(() => import("./admin/component/survey/question"));
const Total = React.lazy(() => import("./admin/component/survey/total"));
const Role = React.lazy(() => import("./admin/component/survey/role"));

// ADMIN MAIL IMPORT
const MailSend = React.lazy(() => import("./admin/component/mail/sendMail"));

////////////////////////////////////////
import NotFound from "./hardComponent/notFound";
import Header from "./hardComponent/header";
import Footer from "./hardComponent/footer";
import SideBar from "./hardComponent/sidebar/index";
import SignIn from "./hardComponent/signIn";
import SignUp from "./hardComponent/signUp";
import ResetPass from "./hardComponent/resetPass";

const HomePage = React.lazy(() => import("./component/homePage"));
const Infor = React.lazy(() => import("./component/survey-gv/infor"));
const Partner = React.lazy(() => import("./component/survey-gv/partner"));
const Assign = React.lazy(() => import("./component/survey-gv/assign"));
const QLDTSV = React.lazy(() => import("./component/qldt/sv"));
const QLDTGV = React.lazy(() => import("./component/qldt/gv"));
const DSL = React.lazy(() => import("./component/classlist"));
const Work = React.lazy(() => import("./component/calendar/work"));

export const RoleContext = createContext();

function PreventRole() {
  const [role, setRole] = useState(null);
  const location = useLocation();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  useLayoutEffect(() => {
    const callApi = async () => {
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
          setRole({ role_id: 0 });
        });
    };

    if (
      isSignedIn &&
      user.emailAddresses[0].emailAddress.includes("@hpu.edu.vn")
    ) {
      callApi();
    } else if (isSignedIn !== undefined) {
      setRole({ role_id: 0 });
    }

    if (
      isSignedIn &&
      !user.emailAddresses[0].emailAddress.includes("@hpu.edu.vn")
    ) {
      window.location.href = "https://sv.hpu.edu.vn/home";
    }
  }, [isSignedIn, location.pathname]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <>
              <SignedIn>
                {location.hash === "" ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate
                    to={decodeURIComponent(
                      location.hash.substring(16, location.hash.length)
                    )}
                    replace
                  />
                )}
              </SignedIn>
              <SignedOut>
                <SignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/sign-up"
          element={
            <>
              <SignedIn>
                <Navigate to="/home" replace />
              </SignedIn>
              <SignedOut>
                <SignUp />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/reset-password"
          element={
            <>
              <SignedIn>
                <Suspense
                  fallback={
                    <div className="loading">
                      <ReactLoading
                        type="spin"
                        color="#0083C2"
                        width={"50px"}
                        height={"50px"}
                      />
                    </div>
                  }
                >
                  <ResetPass />
                </Suspense>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" />
              </SignedOut>
            </>
          }
        />

        <Route path="*" element={<NotFound />} />

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
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/survey-gv/infor"
                    )}`}
                  />
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
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/survey-gv/partner"
                    )}`}
                  />
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
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/survey-gv/assign"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/calendar/work"
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
                    <Work />
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  {/* <RedirectToSignIn /> */}
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/calendar/work"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/drl/dsl"
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
                    <DSL />
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  {/* <RedirectToSignIn /> */}
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/drl/dsl"
                    )}`}
                  />
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
                    {import.meta.env.VITE_ROLE_QLDT.split("||").find(
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
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/qldt/sv"
                    )}`}
                  />
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
                    {import.meta.env.VITE_ROLE_QLDT.split("||").find(
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
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/qldt/gv"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/survey/total"
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
                      <Total />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  {/* <RedirectToSignIn /> */}
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/survey/total"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />
        </Route>

        {/* ADMIN ROUTE */}
        <Route path="/admin" element={<HardAdmin role={role} />}>
          <Route path="/admin" element={<Navigate to="dashboard" />} />
          <Route
            path="dashboard"
            element={
              <>
                <SignedIn>
                  {import.meta.env.VITE_ROLE_ADMIN !==
                    role?.role_id.toString() ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <></>
                  )}
                </SignedIn>
                <SignedOut>
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/admin/dashboard"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="survey"
            element={<Navigate to="survey/init" replace />}
          />
          <Route
            path="survey/init"
            element={
              <>
                <SignedIn>
                  <Suspense
                    fallback={
                      <div className="mt-[80px] ml-[250px] p-[10px]">
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
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/admin/survey/init"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="survey/approve"
            element={
              <>
                <SignedIn>
                  <Suspense
                    fallback={
                      <div className="mt-[80px] ml-[250px] p-[10px]">
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
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/admin/survey/approve"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="survey/question"
            element={
              <>
                <SignedIn>
                  <Suspense
                    fallback={
                      <div className="mt-[80px] ml-[250px] p-[10px]">
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
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/admin/survey/question"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="survey/total"
            element={
              <>
                <SignedIn>
                  <Suspense
                    fallback={
                      <div className="mt-[80px] ml-[250px] p-[10px]">
                        <ReactLoading
                          type="spin"
                          color="#0083C2"
                          width={"50px"}
                          height={"50px"}
                        />
                      </div>
                    }
                  >
                    {import.meta.env.VITE_ROLE_ADMIN ===
                      role?.role_id.toString() ? (
                      <Total />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  {/* <RedirectToSignIn /> */}
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/admin/survey/total"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="survey/role"
            element={
              <>
                <SignedIn>
                  <Suspense
                    fallback={
                      <div className="mt-[80px] ml-[250px] p-[10px]">
                        <ReactLoading
                          type="spin"
                          color="#0083C2"
                          width={"50px"}
                          height={"50px"}
                        />
                      </div>
                    }
                  >
                    {import.meta.env.VITE_ROLE_ADMIN ===
                      role?.role_id.toString() ? (
                      <Role />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  {/* <RedirectToSignIn /> */}
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/admin/survey/role"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          />

          <Route
            path="mail/mailsend"
            element={
              <>
                <SignedIn>
                  <Suspense
                    fallback={
                      <div className="mt-[80px] ml-[250px] p-[10px]">
                        <ReactLoading
                          type="spin"
                          color="#0083C2"
                          width={"50px"}
                          height={"50px"}
                        />
                      </div>
                    }
                  >
                    {import.meta.env.VITE_ROLE_ADMIN ===
                      role?.role_id.toString() ? (
                      <MailSend />
                    ) : (
                      <Navigate to="/home" replace={true} />
                    )}
                  </Suspense>
                </SignedIn>

                <SignedOut>
                  {/* <RedirectToSignIn /> */}
                  {/* <Navigate to="/sign-in" /> */}
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/admin/mail/mailsend"
                    )}`}
                  />
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
  const location = useLocation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [menuBtn, setMenuBtn] = useState(false);
  const transitions = useTransition(menuBtn, {
    from: { opacity: 0 },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      duration: 200,
    },
  });
  useEffect(() => {
    const resize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    setMenuBtn(false);
  }, [location]);

  useEffect(() => {
    menuBtn
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [menuBtn]);
  if (role) {
    return (
      <div className="flex flex-col">
        <Header windowWidth={windowWidth} />
        <div className="flex pl-[15px] pr-[15px] mt-[40px] gap-[2%] flex-row-reverse">
          <SideBar
            windowWidth={windowWidth}
            menuBtn={menuBtn}
            setMenuBtn={setMenuBtn}
          />
          <Outlet />
        </div>
        <div className="mb-[50px] md:mb-[70px] lg:mb-0">
          <Footer />
        </div>
        {windowWidth <= 1024 ? (
          <>
            {transitions(
              (style, menuBtn) =>
                menuBtn && (
                  <animated.div
                    style={style}
                    className="fixed top-0 left-0 right-0 bottom-0 z-[9] bg-overlay"
                    onClick={() => setMenuBtn(!menuBtn)}
                  />
                )
            )}
            <div className="fixed flex w-full bottom-0 h-[50px] md:h-[70px] bg-white justify-end items-center z-10 border-t-[1px] border-solid border-bordercl">
              <div
                className={`flex-col justify-center items-center h-full w-[20%] flex cursor-pointer border-b-[5px] border-solid ${menuBtn ? " border-primary" : "border-white"
                  }`}
                onClick={() => setMenuBtn(!menuBtn)}
              >
                <AiOutlineMenu
                  size={`${windowWidth >= 768 ? "30px" : "22px"}`}
                />
                <p className="font-semibold text-[12px] md:text-[18px]">Menu</p>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return <TopBarProgress />;
  }
}

function HardAdmin({ role }) {
  // console.log(role);
  // const navigate = useNavigate();
  // if
  if (role) {
    return (
      <div className="flex flex-col">
        <HeaderAdmin />
        <div className="flex">
          <SideBarAdmin />
          <Outlet />
        </div>
      </div>
    );
  } else {
    return <TopBarProgress />;
  }

  // if (role?.role_id.toString() === import.meta.env.VITE_ROLE_ADMIN) {
  //   return (
  //     <div className="flex flex-col">
  //       <HeaderAdmin />
  //       <Outlet />
  //     </div>
  //   );
  // } else if (!role) {
  //   return (
  //     <LoadingBar
  //       progress={100}
  //       color="#0083C2"
  //       height={5}
  //       waitingTime={1000000}
  //     />
  //   );
  // }
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
