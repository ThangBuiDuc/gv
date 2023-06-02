import "../../../App.css";
import { Fragment } from "react";
import { useAuth } from "@clerk/clerk-react";
import ReactLoading from "react-loading";
import Content from "./content";
import { CSVLink } from "react-csv";
import { useQuery } from "@tanstack/react-query";

const headersCSV = [
  {
    label: "STT",
    key: "stt",
  },
  {
    label: "Mã lớp môn học",
    key: "class_code",
  },
  {
    label: "Lớp môn học",
    key: "class_name",
  },
  {
    label: "Phòng học",
    key: "",
  },
  {
    label: "Thời gian dự giờ",
    key: "",
  },
  {
    label: "Số tiết dự giờ",
    key: "",
  },
  {
    label: "Tên giảng viên phụ trách",
    key: "name",
  },
  {
    label: "Chủ tịch hội đồng",
    key: "teacher_attend_1",
  },
  {
    label: "Thư ký",
    key: "teacher_attend_2",
  },
  {
    label: "Uỷ viên",
    key: "teacher_attend_3",
  },
  {
    label: "Điểm trung bình",
    key: "teacher_result",
  },
  {
    label: "Ý kiến riêng",
    key: "",
  },
];

function compare(a, b) {
  return a.class_name.localeCompare(b.class_name);
}

export default function Index() {
  const { getToken } = useAuth();

  const role = useQuery({
    queryKey: ["getRole_assign_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_ROLE_API}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_ROLE,
          })}`,
        },
      }).then((res) => res.json());
    },
  });

  const present = useQuery({
    queryKey: ["getPresent_assign_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRESENT_API}`).then((res) =>
        res.json()
      );
    },
    enabled: role.data?.result[0].is_truong_khoa,
  });

  const staff = useQuery({
    queryKey: ["getStaff_assign_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_GET_ASSIGN_STAFF_API}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
          })}`,
        },
      }).then((res) => res.json());
    },
    enabled: role.data?.result[0].is_truong_khoa,
  });

  const question = useQuery({
    queryKey: ["getQuestion_assign_CTGD"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_GV_BATCH_QUESTION_API}${
          present.data.hientai[0].hocky
        }/${present.data.hientai[0].manamhoc}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
            })}`,
          },
        }
      ).then((res) => res.json());
    },
    enabled: present.data?.hientai.length > 0,
  });

  const data = useQuery({
    queryKey: ["getData_assign_CTGD"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_GET_ASSIGN_OBJECT_API}${
          role.data?.result[0].khoa_gv
        }/${present.data.hientai[0].hocky}/${present.data.hientai[0].manamhoc}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
            })}`,
          },
        }
      ).then((res) => res.json());
    },
    enabled:
      present.data?.hientai.length > 0 &&
      role.data?.result[0].is_truong_khoa === true,
  });
  // const data =

  // console.log();

  if (role.isLoading || role.isFetching) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công dự giờ</h2>
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

  if (!role.data.result[0].is_truong_khoa) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công dự giờ</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản hiện tại không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (
    present.isLoading ||
    present.isFetching ||
    staff.isLoading ||
    staff.isFetching ||
    question.isLoading ||
    question.isFetching ||
    data.isLoading ||
    data.isFetching
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công dự giờ</h2>
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

  if (
    role.data?.result.lenght === 0 ||
    present.data?.hientai.length === 0 ||
    question.data?.result.length === 0 ||
    staff.data?.result.length === 0 ||
    data.data?.result.length === 0
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công dự giờ</h2>
        </div>
        <div className="flex justify-center">
          <h3>Đã có lỗi xảy ra. Vùi lòng tải lại trang</h3>
        </div>
      </div>
    );
  }

  if (data.data.result.length === 0) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công dự giờ</h2>
        </div>
        <div className="flex justify-center">
          <h3>Hiện tại chưa có lớp môn học nào được duyệt khảo sát trong kỳ</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Phân công dự giờ</h2>
      </div>
      <>
        <div className="flex justify-end">
          <CSVLink
            data={data.data?.result.sort(compare).map((item, index) => {
              return {
                stt: index + 1,
                class_name: item.class_name,
                teacher_attend_1: item.teacher_attend_1,
                teacher_attend_2: item.teacher_attend_2,
                teacher_attend_3: item.teacher_attend_3,
                teacher_result: item.teacher_result,
                name: item.user.name,
                class_code: item.class_code,
              };
            })}
            headers={headersCSV}
            className="btn"
            filename={`${new Date().toDateString()}-qldtGV.csv`}
          >
            Xuất CSV
          </CSVLink>
          {/* <button
                className="btn w-[fit]"
                onClick={() => {
                  setData(null);
                  setStatus((pre) => !pre);
                }}
              >
                Click Me!
              </button> */}
        </div>
        <div className="flex flex-col gap-[20px]">
          <h3 className="self-center text-primary text-center">
            Những lớp môn học chưa phân công dự giờ
          </h3>
          {data.data?.result
            .sort(compare)
            .filter((item) => item.teacher_attend_1 === null)
            .map((item, index) => {
              return (
                <Fragment key={index}>
                  <Content
                    data={item}
                    staff={staff.data?.result}
                    present={present.data?.hientai}
                    question={question.data?.result}
                  />
                </Fragment>
              );
            })}
        </div>
        <div className="flex flex-col gap-[20px]">
          <h3 className="self-center text-primary">
            Những lớp môn học đã phân công dự giờ
          </h3>
          {data.data?.result
            .filter((item) => item.teacher_attend_1 !== null)
            .map((item, index) => {
              return (
                <Fragment key={index}>
                  <Content
                    data={item}
                    staff={staff.data?.result}
                    present={present.data?.hientai}
                  />
                </Fragment>
              );
            })}
        </div>
      </>
    </div>
  );

  // console.log(role);

  // return (
  //   <>
  //     <div className="wrap">
  //       <h1>{role.data.result[0].role_id}</h1>
  //     </div>
  //   </>
  // );

  // useLayoutEffect(() => {
  //   const callApi = async () => {
  //     return await fetch(`${import.meta.env.VITE_ROLE_API}`, {
  //       method: "GET",
  //       headers: {
  //         authorization: `Bearer ${await getToken({
  //           template: import.meta.env.VITE_TEMPLATE_ROLE,
  //         })}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((res) => setRole(res.result[0]));
  //   };

  //   callApi();
  // }, []);

  // useEffect(() => {
  //   let callApi = async () => {
  //     await fetch(`${import.meta.env.VITE_PRESENT_API}`)
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.hientai) setPresent(res.hientai[0]);
  //       });
  //   };

  //   if (role.is_truong_khoa) callApi();
  // }, [role]);

  // useLayoutEffect(() => {
  //   let callApi = async () => {
  //     await fetch(`${import.meta.env.VITE_GET_ASSIGN_STAFF_API}`, {
  //       method: "GET",
  //       headers: {
  //         authorization: `Bearer ${await getToken({
  //           template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
  //         })}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.result.length > 0) setStaff(res.result);
  //         else setStaff("empty");
  //       });
  //   };

  //   if (present && role.is_truong_khoa) callApi();
  // }, [present]);

  // useEffect(() => {
  //   const callApi = async () => {
  //     fetch(
  //       `${import.meta.env.VITE_GV_BATCH_QUESTION_API}${present.hocky}/${
  //         present.manamhoc
  //       }`,
  //       {
  //         method: "GET",
  //         headers: {
  //           authorization: `Bearer ${await getToken({
  //             template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
  //           })}`,
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.result.length > 0) setQuestion(res.result);
  //       });
  //   };

  //   if (present) callApi();
  // }, [present]);

  // useLayoutEffect(() => {
  //   let callApi = async () => {
  //     await fetch(
  //       `${import.meta.env.VITE_GET_ASSIGN_OBJECT_API}${role.khoa_gv}/${
  //         present.hocky
  //       }/${present.manamhoc}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           authorization: `Bearer ${await getToken({
  //             template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
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
  //   if (present && role.is_truong_khoa) callApi();
  // }, [status, present]);

  // return (
  //   <div className="wrap">
  //     <div className="flex justify-center">
  //       <h2 className="text-primary">Phân công dự giờ</h2>
  //     </div>
  //     {role.data.result[0].is_truong_khoa ? (
  //       data === "empty" ? (
  //         <div className="flex justify-center">
  //           <h3>
  //             Hiện tại chưa có lớp môn học nào được duyệt khảo sát trong kỳ
  //           </h3>
  //         </div>
  //       ) : data ? (
  //         <>
  //           <div className="flex justify-end">
  //             <CSVLink
  //               data={data.map((item, index) => {
  //                 return {
  //                   stt: index + 1,
  //                   class_name: item.class_name,
  //                   teacher_attend_1: item.teacher_attend_1,
  //                   teacher_attend_2: item.teacher_attend_2,
  //                   teacher_attend_3: item.teacher_attend_3,
  //                   teacher_result: item.teacher_result,
  //                   name: item.user.name,
  //                   class_code: item.class_code,
  //                 };
  //               })}
  //               headers={headersCSV}
  //               className="btn"
  //               filename={`${new Date().toDateString()}-qldtGV.csv`}
  //             >
  //               Xuất CSV
  //             </CSVLink>
  //             {/* <button
  //               className="btn w-[fit]"
  //               onClick={() => {
  //                 setData(null);
  //                 setStatus((pre) => !pre);
  //               }}
  //             >
  //               Click Me!
  //             </button> */}
  //           </div>
  //           <div className="flex flex-col gap-[20px]">
  //             <h3 className="self-center text-primary text-center">
  //               Những lớp môn học chưa phân công dự giờ
  //             </h3>
  //             {data
  //               .filter((item) => item.teacher_attend_1 === null)
  //               .map((item, index) => {
  //                 return (
  //                   <Fragment key={index}>
  //                     <Content
  //                       data={item}
  //                       staff={staff}
  //                       present={present}
  //                       setStatus={setStatus}
  //                       question={question}
  //                       setData={setData}
  //                     />
  //                   </Fragment>
  //                 );
  //               })}
  //           </div>
  //           <div className="flex flex-col gap-[20px]">
  //             <h3 className="self-center text-primary">
  //               Những lớp môn học đã phân công dự giờ
  //             </h3>
  //             {data
  //               .filter((item) => item.teacher_attend_1 !== null)
  //               .map((item, index) => {
  //                 return (
  //                   <Fragment key={index}>
  //                     <Content data={item} staff={staff} present={present} />
  //                   </Fragment>
  //                 );
  //               })}
  //           </div>
  //         </>
  //       ) : (
  //         <ReactLoading
  //           type="spin"
  //           color="#0083C2"
  //           width={"50px"}
  //           height={"50px"}
  //           className="self-center"
  //         />
  //       )
  //     ) : (
  //       <div className="flex justify-center">
  //         <h3>Tài khoản hiện tại không có quyền phân công dự giờ</h3>
  //       </div>
  //     )}
  //   </div>
  // );
}
