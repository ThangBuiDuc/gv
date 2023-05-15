import style from "./index.module.css";
import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/clerk-react";
// import { useNavigate } from "react-router";
import ReactLoading from "react-loading";
import ReactInputVerificationCode from "react-input-verification-code";

export default function SignUp() {
  const [progress, setProgress] = useState("");
  const [codeProgress, setCodeProgress] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // console.log(ref)

  // const {isSignedIn} = useAuth();

  // const navigate = useNavigate();

  const { isLoaded, signUp, setActive } = useSignUp();

  useEffect(() => {
    async function verify() {
      await signUp
        .attemptEmailAddressVerification({ code: verifyCode })
        .then(async (result) => {
          if (result.status === "complete") {
            await fetch("/api/signUp", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: `${result.createdUserId}`,
                magv: `${result.username.substring(
                  0,
                  result.username.length - 1
                )}`,
                fullname: name,
              }),
            }).then((res) => {
              if (res.status === 200) {
                setActive({ session: result.createdSessionId });
                window.location.href = "/home";
                // setCodeProgress("is incorrect");
                // console.log(isSignedIn)
              }
            });
          }
        })
        .catch(() => {
          //   console.log("error", err.errors[0].message);
          setCodeProgress("is incorrect");
          setVerifyCode("");
        });
    }
    if (verifyCode.length === 6) {
      verify();
    }
  }, [verifyCode]);

  //   const handleOncompleted = async () => {
  //     console.log(verifyCode)
  // if (verifyCode[4] !== ".") {
  //     console.log(verifyCode)
  //   await signUp
  //     .attemptEmailAddressVerification({ code: verifyCode })
  //     .then((result) => console.log(result))
  //     .catch((err) => {
  //     //   console.log("error", err.errors[0].message);
  //       setCodeProgress("is incorrect")
  //       setVerifyCode("");
  //     });
  // }
  //   };

  if (!isLoaded) {
    // handle loading state
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    setProgress("");
    if (emailAddress === "" || password === "") {
      setProgress("empty");
      setLoading(false);
    } else {
      // Check the sign up response to
      // decide what to do next.
      setLoading(true);
      if (emailAddress.includes("@hpu.edu.vn")) {
        await fetch(`${import.meta.env.VITE_APP_API_SIGN_UP}${emailAddress}`)
          .then((res) => res.json())
          .then(async (res) => {
            if (res.result.length !== 0) {
              setName(res.result[0].name);
              await signUp
                .create({
                  emailAddress: emailAddress,
                  password: password,
                  username: res.result[0].magiaovien + "z",
                })
                .then(async (result) => {
                  if (result.status === "missing_requirements") {
                    setProgress(result.status);
                  }
                  await signUp.prepareEmailAddressVerification();
                })
                .catch((err) => {
                  // console.log("error", err.errors[0].message);
                  setProgress(err.errors[0].message);
                });
              // setProgress('missing_requirements')
            } else {
              setProgress("none");
              setLoading(false);
            }
          });
      } else {
        setProgress("invalid");
        setLoading(false);
      }
      //   await fetch(`${process.env.REACT_APP_API_SIGN_UP}${emailAddress}`)
      //     .then((res) => res.json())
      //     .then(async (res) => {
      //       if (res.verify.length === 0) setProgress("invalidCode");
      //       else if (res.verify[0].email && res.verify[0].email !== emailAddress){
      //         setProgress("unduplicated");
      //         setVerifyEmail(res.verify[0].email);
      //       }

      //       else if (!res.verify[0].email) setProgress("emptyEmail");

      //       if (res.verify.length !== 0 && res.verify[0].email === emailAddress) {
      //         setName(res.verify[0].hoten);
      //         await signUp
      //           .create({
      //             emailAddress: emailAddress,
      //             password: password,
      //             username: username + "z",
      //           })
      //           .then(async (result) => {
      //             if (result.status === "missing_requirements") {
      //               setProgress(result.status);
      //             }
      //             await signUp
      //               .prepareEmailAddressVerification()
      //               .then((result) => console.log(result))
      //               .catch((err) => console.log("error", err.errors[0].message));
      //           })
      //           .catch((err) => {
      //             // console.log("error", err.errors[0].message);
      //             setProgress(err.errors[0].message);
      //           });
      //         // setProgress('missing_requirements')
      //       }

      //       // console.log(res)
      //     })
      //     // .catch((e)=>{
      //     //   setLoading(false);
      //     //   // console.log("1")
      //     // })
      //     .finally(() => {
      //       setLoading(false);
      //     });
      // }
    }
  }

  return progress === "missing_requirements" ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div
        className={style.verify}
        style={{ flexDirection: "column", display: "flex", gap: "10px" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Xác thực</h2>
        <p>
          Một mã xác thực đã được gửi đến email bạn đăng ký. Vui lòng xác thực
          để tiếp tục sử dụng.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            pointerEvents: verifyCode.length === 6 ? "none" : "unset",
          }}
        >
          <ReactInputVerificationCode
            placeholder=""
            onChange={setVerifyCode}
            value={verifyCode}
            autoFocus={true}
            length={6}
          />
        </div>
        {codeProgress === "is incorrect" ? (
          <p style={{ color: "red", fontSize: "12px" }}>
            Mã xác thực sai. Vui lòng nhập lại!
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className={style.Wrapform}>
        <h2 style={{ color: "black", textAlign: "center" }}>Đăng ký</h2>
        <form className={style.form} onSubmit={submit}>
          {/* <div>
            <input
              type="text"
              value={username}
              className={style.input}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Mã sinh viên"
            />
            {progress === "That username is taken. Please try another." ? (
              <p style={{ color: "red", fontSize: "12px" }}>
                Mã sinh viên đã được đăng ký! Liên hệ phòng quản trị mạng( Tầng
                2 - Nhà G ) nếu có sai sót!
              </p>
            ) : (
              <></>
            )}
          </div> */}
          <div>
            {/* <label htmlFor="email">Email</label> */}
            <input
              type="email"
              value={emailAddress}
              className={style.input}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Email"
            />
            {progress === "That email address is taken. Please try another." ? (
              <p style={{ color: "red", fontSize: "12px" }}>
                Email đã được đăng ký!
              </p>
            ) : (
              <></>
            )}
          </div>
          <div>
            {/* <label htmlFor="password">Mật khẩu</label> */}
            <input
              type="password"
              value={password}
              className={style.input}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />
            {progress === "Passwords must be 8 characters or more." ? (
              <p style={{ color: "red", fontSize: "12px" }}>
                Mật khẩu phải dài hơn 8 ký tự!
              </p>
            ) : progress === "invalid" ? (
              <p style={{ color: "red", fontSize: "12px" }}>
                Vui lòng nhập email @hpu.edu.vn
              </p>
            ) : progress === "empty" ? (
              <p style={{ color: "red", fontSize: "12px" }}>
                Vui lòng nhập đủ thông tin!
              </p>
            ) : progress ===
              "Password has been found in an online data breach.  For account safety, please use a different password." ? (
              <p style={{ color: "red", fontSize: "12px" }}>
                Mật khẩu yếu. Nhập mật khẩu mạnh hơn!
              </p>
            ) : progress === "none" ? (
              <p style={{ color: "red", fontSize: "12px" }}>
                Email không tồn tại trong hệ thống!
              </p>
            ) : (
              <></>
            )}
          </div>
          <div>
            {loading ? (
              <ReactLoading
                type="spin"
                color="#0083C2"
                width={"30px"}
                height={"30px"}
                className={style.loading}
              />
            ) : (
              <button className={style.submit}>Đăng ký</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
