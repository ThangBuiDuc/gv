import "../../../App.css";
import { useEffect, useRef } from "react";

export default function Index({ checked, setChecked }) {
  // const [position, setPositon] = useState();
  const ref = useRef();
  // useEffect(() => {
  //   setPositon(ref.current.offsetTop);
  // }, []);
  // console.log('re-render')
  useEffect(() => {
    const nav = ref.current.offsetTop;
    // console.log(ref.current.childNodes[0])
    const handleScroll = () => {
      if (window.scrollY > nav) {
        ref.current.style =
          "position:fixed; width:80%; z-index:99; top:0;left:0;padding:0px 30px 30px 35px";
        ref.current.childNodes[0].style =
          "background-color:#0083c28a; border-radius: 10px ; padding: 5px";
      } else ref.current.style = "positon:none";
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //   useEffect(() => {
  //     let nav = ref.current;
  //     //   console.log(nav.offsetTop)
  //     if (position > nav.offsetTop)
  //       nav.style = "position:fixed; width:100%; z-index:99; top:0;left:0;";
  //     else nav.style = "positon:none";
  //   }, [position]);
  return (
    <div ref={ref}>
      <div className={`flex justify-evenly`}>
        <button
          className="btn"
          onClick={() =>
            setChecked(
              checked.map((item) => {
                item = true;
                return item;
              })
            )
          }
        >
          Chọn tất cả
        </button>
        <button
          className="btn"
          onClick={() =>
            setChecked(
              checked.map((item) => {
                item = false;
                return item;
              })
            )
          }
        >
          Bỏ chọn tất cả
        </button>
        <button className="btn">Duyệt</button>
      </div>
    </div>
  );
}
