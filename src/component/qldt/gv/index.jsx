// import React from 'react'
import { useEffect, useLayoutEffect, useState } from "react";
import "../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";

function compare(a, b) {
  return a.class_name.localeCompare(b.class_name);
}

export default function Index() {
  const { getToken } = useAuth();
  const [present, setPresent] = useState(null);
  const [course, setCourse] = useState(null);
  const [afterUpdate, setAfterUpdate] = useState(false);

  useLayoutEffect(() => {
    let callApi = async () => {
      await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.hientai) setPresent(res.hientai[0]);
        });
    };

    callApi();
  }, []);

  useEffect(() => {
    let callApi = async () => {
      fetch(
        `${import.meta.env.VITE_QLDT_COURSE}${present.manamhoc}/${
          present.hocky
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_QLDT,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.result.length > 0) setCourse(res.result.sort(compare));
          else setCourse("empty");
        });
    };
    if (present) callApi();
  }, [present, afterUpdate]);

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Thực hiện quy định, quy chế đào tạo</h2>
      </div>
      {course === "empty" ? (
        <div className="flex justify-center">
          <h3>Hiện tại chưa có môn học trong kỳ được duyệt đánh giá</h3>
        </div>
      ) : course ? (
        course.map((item, index) => {
          return (
            <div className="flex flex-col" key={index}>
              <Content
                data={item}
                present={present}
                afterUpdate={afterUpdate}
                setAfterUpdate={setAfterUpdate}
              />
            </div>
          );
        })
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
