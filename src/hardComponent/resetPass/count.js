import { useState, useEffect, useRef } from "react";

export default function Count() {
  const [countSec, setCountSec] = useState(5);
  const countRef = useRef(null);
  countRef.current = countSec;

  useEffect(() => {
    const interval = setInterval(() => {
      if (countRef.current === 0) clearInterval(interval);
      else setCountSec((pre) => pre - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if(countSec===0) window.location.replace('/home')

  return countSec === 0 ? (
    <p style={{ color: "green", fontSize: "14px" }}>Đang chuyển hướng ...</p>
  ) : (
    <p style={{ color: "green", fontSize: "14px" }}>
      Đổi mật khẩu thành công, chuyển hướng sau {countSec} giây
    </p>
  );
}
