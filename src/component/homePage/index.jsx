import "../../App.css";
import ImgSlider from "./imageSlider";
import { useLayoutEffect, useState } from "react";
import ReactLoading from "react-loading";
import noIMG from "../../assets/noIMG.png";

export default function Index() {
  const [blog, setBlog] = useState([]);

  useLayoutEffect(() => {
    fetch("/api/article")
      .then((res) => res.json())
      .then((res) => {
        const reverse = res.data1.articles.reverse();
        setBlog(reverse);
      });
  }, []);

  return (
    <div className="wrap ">
      {blog.length > 0 ? (
        <>
          <ImgSlider />
          <div className="flex flex-col justify-between w-[100%] gap-[20px]">
            {blog.map((item, index) => {
              return (
                <div
                  className="flex flex-col md:flex-row h-fit w-[100%] g-[2%] [&>img]:object-cover md:[&>img]:w-[40%] [&>img]:max-h-[250px]"
                  key={index}
                  style={{ gap: "2%" }}
                >
                  <img src={item.image ? item.image.src : noIMG} alt="" />
                  <div className="md:w-[58%]">
                    <a
                      href={`https://hpu.edu.vn/blogs/lich-tuan/${item.handle}`}
                      className="no-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h3 className="text-primary w-[100%]">{item.title}</h3>
                    </a>
                    <p className="w-[100%] overflow-hidden text-ellipsis text-[14px] des">
                      {item.meta_description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <a
            href={`https://hpu.edu.vn/blogs/lich-tuan`}
            className="text-center text-primary font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem Tất cả
          </a>
        </>
      ) : (
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      )}
    </div>
  );
}
