import "../../../App.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import ReactLoading from "react-loading";
import Content from "./content";
import { BsPatchQuestion } from "react-icons/bs";

function compare(a, b) {
  return a.class_name.localeCompare(b.class_name);
}

export default function Index() {
  const { getToken } = useAuth();

  // useLayoutEffect(() => {
  //   let callApi = async () => {
  //     await fetch(`${import.meta.env.VITE_PRESENT_API}`)
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.hientai) setPresent(res.hientai[0]);
  //       });
  //   };

  //   callApi();
  // }, []);

  const present = useQuery({
    queryKey: ["getPresent_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => (res?.hientai.length > 0 ? res?.hientai[0] : null));
    },
  });

  const data = useQuery({
    queryKey: ["getData_infor_CTGD"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_STATUS_SURVEY_GV_API}${present.data?.hocky}/${
          present.data?.manamhoc
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_GV,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) =>
          res.result.length > 0 ? res.result.sort(compare) : null
        );
    },
    enabled: present.data !== null && present.data !== undefined,
  });

  if (
    (present.isLoading && present.isFetching) ||
    (data.isLoading && data.isFetching)
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phản hồi công tác giảng dạy</h2>
        </div>
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );
  }

  if (data.data === null) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phản hồi công tác giảng dạy</h2>
        </div>
        <h3 className="text-center">
          Hiện tại chưa có môn học nào trong quá trình phản hồi công tác giảng
          dạy kỳ hiện tại
        </h3>
      </div>
    );
  }

  // useEffect(() => {
  //   let callApi = async () => {
  //     fetch(
  //       `${import.meta.env.VITE_STATUS_SURVEY_GV_API}/${present.hocky}/${
  //         present.manamhoc
  //       }`,
  //       {
  //         method: "GET",
  //         headers: {
  //           authorization: `Bearer ${await getToken({
  //             template: import.meta.env.VITE_TEMPLATE_GV_GV,
  //           })}`,
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.result.length > 0) setData(res.result.sort(compare));
  //         else setData("empty");
  //       });
  //   };

  //   if (present) callApi();
  // }, [present]);

  // console.log(present);
  // console.log(data);
  return (
    <div className="wrap relative">
      <a
        href="https://drive.google.com/drive/folders/1CLuXyo0iyGV4tymDM4iRwCVHw46g1nQL"
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-[5px] absolute right-[10px] underline"
      >
        <BsPatchQuestion size={22} />
        Hướng dẫn sử dụng
      </a>
      <div className="flex justify-center">
        <h2 className="text-primary">Phản hồi công tác giảng dạy</h2>
      </div>
      {data.data &&
        data.data.map((item, index) => (
          <div className="flex flex-col" key={index}>
            <Content data={item} />
          </div>
        ))}
    </div>
  );
}
