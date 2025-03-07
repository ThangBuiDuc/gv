import "./App.css";
import React, { Suspense, useState, useEffect } from "react";
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

// ADMIN IMPORT
import HeaderAdmin from "./admin/hardComponent/header";
import SideBarAdmin from "./admin/hardComponent/sideBar";

// ADMIN SURVEY IMPORT
const Init = React.lazy(() => import("./admin/component/survey/init"));
const UpdateClass = React.lazy(() =>
  import("./admin/component/survey/updateClass")
);
const UpdateStudent = React.lazy(() =>
  import("./admin/component/survey/updateStudent")
);
const Question = React.lazy(() => import("./admin/component/survey/question"));
const Total = React.lazy(() => import("./admin/component/survey/total"));
const TotalSemester = React.lazy(() =>
  import("./admin/component/survey/totalSemester")
);
const Role = React.lazy(() => import("./admin/component/survey/role"));

// ADMIN MAIL IMPORT
const MailSend = React.lazy(() => import("./admin/component/mail/sendMail"));

// ADMIN TRAIN SCORE
const RLInit = React.lazy(() => import("./admin/component/trainscore/init"));
const RLInfor = React.lazy(() => import("./admin/component/trainscore/infor"));
const RLUpdateClass = React.lazy(() =>
  import("./admin/component/trainscore/updateClass")
);
const RLUpdateStudent = React.lazy(() =>
  import("./admin/component/trainscore/updateStudent")
);

//VBCC
const Search = React.lazy(() => import("./component/vbcc/search"));

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
const Work = React.lazy(() => import("./component/calendar/work"));

// TrainScore
const Classes = React.lazy(() => import("./component/trainScore/classes"));
// const Event = React.lazy(() => import("./component/trainScore/event"));
const SetMonitor = React.lazy(() =>
  import("./component/trainScore/setMonitor")
);
const SetStaff = React.lazy(() => import("./component/trainScore/setStaff"));
const OverAll = React.lazy(() => import("./component/trainScore/overAll"));
const OverAllSemester = React.lazy(() =>
  import("./component/trainScore/overAllSemester")
);

function MainRoute() {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (
    isSignedIn &&
    !user.emailAddresses[0].emailAddress.includes("@hpu.edu.vn")
  ) {
    window.location.href = "https://sv.hpu.edu.vn/home";
  }

  return (
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
              <ResetPass />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" />
            </SignedOut>
          </>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Hard />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />

        {/* SURVEY */}
        <Route
          path="/survey-gv"
          element={<Navigate to="/survey-gv/infor" replace />}
        />
        <Route
          path="/survey-gv/infor"
          element={
            <>
              <SignedIn>
                <Infor />
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
                <Partner />
              </SignedIn>

              <SignedOut>
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
                <Assign />
              </SignedIn>

              <SignedOut>
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/survey-gv/assign"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />

        {/* VBCC */}
        <Route
          path="/vbcc/search"
          element={
            <>
              <SignedIn>
                <Search />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/vbcc/search"
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
                <Work />
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
          path="/qldt/sv"
          element={
            <>
              <SignedIn>
                <QLDTSV />
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
                <QLDTGV />
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
          path="/trainscore/classes"
          element={
            <>
              <SignedIn>
                <Classes />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/trainscore/classes"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />
        {/* <Route
          path="/trainscore/event"
          element={
            <>
              <SignedIn>
                <Event />
              </SignedIn>

              <SignedOut>
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/trainscore/event"
                  )}`}
                />
              </SignedOut>
            </>
          }
        /> */}
        <Route
          path="/trainscore/setMonitor"
          element={
            <>
              <SignedIn>
                <SetMonitor />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/trainscore/setMonitor"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/trainscore/setStaff"
          element={
            <>
              <SignedIn>
                <SetStaff />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/trainscore/setStaff"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/trainscore/overAll"
          element={
            <>
              <SignedIn>
                <OverAll />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/trainscore/overAll"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/trainscore/overAllSemester"
          element={
            <>
              <SignedIn>
                <OverAllSemester />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/trainscore/overAllSemester"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />

        {/* <Route
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
                  <Navigate
                    to={`/sign-in#/?redirect_url=${encodeURIComponent(
                      "/survey/total"
                    )}`}
                  />
                </SignedOut>
              </>
            }
          /> */}
      </Route>
      {/* ADMIN ROUTE */}
      <Route path="/admin" element={<HardAdmin />}>
        <Route path="/admin" element={<Navigate to="dashboard" />} />
        <Route
          path="dashboard"
          element={
            <>
              <SignedIn>
                <></>
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
        <Route path="survey" element={<Navigate to="survey/init" replace />} />
        <Route
          path="survey/init"
          element={
            <>
              <SignedIn>
                <Init />
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
          path="survey/updateClass"
          element={
            <>
              <SignedIn>
                <UpdateClass />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/admin/survey/updateClass"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />
        <Route
          path="survey/updateStudent"
          element={
            <>
              <SignedIn>
                <UpdateStudent />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/admin/survey/updateStudent"
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
                <Question />
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
                <Total />
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
          path="survey/total-semester"
          element={
            <>
              <SignedIn>
                <TotalSemester />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/admin/survey/total-semester"
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
                <Role />
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
        {/* -------------------------- MAIL SEND ---------------------------- */}
        <Route
          path="mail/mailsend"
          element={
            <>
              <SignedIn>
                <MailSend />
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
        {/* ---------------------------- TRAIN SCORE -------------------------- */}
        <Route
          path="trainscore/init"
          element={
            <>
              <SignedIn>
                <RLInit />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/admin/trainscore/init"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />
        <Route
          path="trainscore/update-class"
          element={
            <>
              <SignedIn>
                <RLUpdateClass />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/admin/trainscore/update-class"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />
        <Route
          path="trainscore/update-student"
          element={
            <>
              <SignedIn>
                <RLUpdateStudent />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/admin/trainscore/update-student"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />
        <Route
          path="trainscore/infor"
          element={
            <>
              <SignedIn>
                <RLInfor />
              </SignedIn>

              <SignedOut>
                {/* <RedirectToSignIn /> */}
                {/* <Navigate to="/sign-in" /> */}
                <Navigate
                  to={`/sign-in#/?redirect_url=${encodeURIComponent(
                    "/admin/trainscore/infor"
                  )}`}
                />
              </SignedOut>
            </>
          }
        />
      </Route>
    </Routes>
  );
}

function Hard() {
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
  return (
    <div className="flex flex-col">
      <Header windowWidth={windowWidth} />
      <div className="flex pl-[15px] pr-[15px] mt-[40px] gap-[2%] flex-row-reverse">
        <SideBar
          windowWidth={windowWidth}
          menuBtn={menuBtn}
          setMenuBtn={setMenuBtn}
        />
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
          <Outlet />
        </Suspense>
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
              className={`flex-col justify-center items-center h-full w-[20%] flex cursor-pointer border-b-[5px] border-solid ${
                menuBtn ? " border-primary" : "border-white"
              }`}
              onClick={() => setMenuBtn(!menuBtn)}
            >
              <AiOutlineMenu size={`${windowWidth >= 768 ? "30px" : "22px"}`} />
              <p className="font-semibold text-[12px] md:text-[18px]">Menu</p>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

function HardAdmin() {
  // console.log(role);
  // const navigate = useNavigate();
  // if
  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      <div className="flex">
        <SideBarAdmin />
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
          <Outlet />
        </Suspense>
      </div>
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
      <MainRoute />
    </ClerkProvider>
  );
}

function App() {
  return <Clerk />;
}

export default App;
