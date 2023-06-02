import "../../App.css";
import { sideBarData } from "./sideBarData";
import SubMenu from "./subMenu";
import { Fragment } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { FaTimes } from "react-icons/fa";
import { useTransition, animated } from "react-spring";

export default function Index({ windowWidth, menuBtn, setMenuBtn }) {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const transitions = useTransition(menuBtn, {
    from: { opacity: 0, transform: "translateX(100%)" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(100%)" },
    config: {
      duration: 200,
    },
  });

  const handleLogIn = () => {
    navigate("/sign-in");
  };

  const handleLogOut = () => {
    signOut();
    navigate("/home");
  };
  return (
    <>
      {windowWidth > 1024 ? (
        <div className="w-[18%] min-h-[700px] flex flex-col gap-[20px]">
          {sideBarData.map((item, index) => {
            return (
              <Fragment key={index}>
                <SubMenu item={item} index={index} />
              </Fragment>
            );
          })}
        </div>
      ) : (
        transitions(
          (style, menuBtn) =>
            menuBtn && (
              <animated.div
                style={style}
                className="fixed bg-white z-[9999]  w-[75%] p-[5px] top-0 right-0 bottom-[50px] md:bottom-[70px] border-solid border-[1px] border-bordercl smallTablet:w-[50%] md:w-[40%] lg:w-[30%] xl:static xl:w-[18%] xl:min-h-[700px] flex flex-col gap-[20px]"
              >
                <IconContext.Provider
                  value={{ className: "self-end cursor-pointer" }}
                >
                  <FaTimes size={"30px"} onClick={() => setMenuBtn(!menuBtn)} />
                </IconContext.Provider>
                {isSignedIn ? (
                  <div className="flex gap-[10px] justify-evenly items-center">
                    <img
                      src={`#`}
                      alt="avatar"
                      className="align-middle w-[70px] h-[70px] rounded-[50%] overflow-hidden border-solid border-[1px] border-[#00000029]"
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p className="text-primary">{user.publicMetadata.name}</p>
                      <button
                        style={{ marginBottom: "0px" }}
                        className="cursor-pointer text-black font-semibold"
                        onClick={handleLogOut}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLogIn}
                    className="cursor-pointer text-white font-semibold mr-[20px]"
                  >
                    Đăng nhập
                  </button>
                )}
                {sideBarData.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <SubMenu item={item} index={index} />
                    </Fragment>
                  );
                })}
              </animated.div>
            )
        )
      )}
    </>
  );
}
