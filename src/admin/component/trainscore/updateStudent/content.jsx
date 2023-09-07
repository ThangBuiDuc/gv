import "../../../../App.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Index() {
  const queryClient = useQueryClient();
  const batch = queryClient.getQueryData(["RL_BATCH"]);
  const { getToken } = useAuth();
  const [mergeSV, setMergeSV] = useState();
  const [checkAll, setCheckAll] = useState(false);

  const question = useQuery({
    queryKey: ["RL_QUESTION_GROUPQUESTION"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_QUESTION_GROUPQUESTION).then(
        (res) => res.json()
      );
    },
  });

  const studentPresent = useQuery({
    queryKey: ["RL_STUDENT_PRESENT"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_RL_PRESENT_SV}${batch?.id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_ADMIN,
          })}`,
        },
      }).then((res) => res.json());
      // .then((res) => (res ? res : null));
    },
  });

  const listSV = useQuery({
    queryKey: ["RL_LIST_SV"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_EDUMNG_SV_CLASS}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_RL_EDU,
          })}`,
        },
        body: JSON.stringify({
          malop: studentPresent?.data.classes.map((item) => item.class_code),
        }),
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
    },
    enabled: studentPresent.data !== null && studentPresent.data !== undefined,
  });

  useEffect(() => {
    if (studentPresent?.data && listSV?.data) {
      setMergeSV(
        listSV?.data.reduce((total, item) => {
          if (
            studentPresent?.data.enrollments.some(
              (el) => el.student_code === item.masv
            )
          ) {
            return total;
          } else {
            let classSV = studentPresent?.data.classes.find(
              (el1) => el1.class_code === item.malop
            );
            let rawData = {
              student_code: item.masv,
              class_code: item.malop,
              monitor: classSV.monitor,
              staff: classSV.staff,
              fullname: item.fullname,
              isChecked: false,
            };
            return [...total, rawData];
          }
        }, [])
      );
    }
  }, [studentPresent?.data, listSV?.data]);

  const mutation = useMutation({
    mutationFn: async () => {
      let checkedMergeSV = mergeSV.filter((item) => item.isChecked);
      let enrollments = checkedMergeSV.map((item) => {
        return {
          batch_id: batch.id,
          class_code: item.class_code,
          student_code: item.student_code,
          status: item.monitor === null || item.staff === null ? false : true,
        };
      });

      let assessment_groups = checkedMergeSV.reduce((total, item) => {
        let rawData = question?.data.groups.map((el) => {
          if (item.monitor && item.staff) {
            return {
              batch_id: batch.id,
              group_id: el.id,
              student_code: item.student_code,
              monitor_code: item.monitor,
              staff_code: item.staff,
            };
          }

          if (item.monitor) {
            return {
              batch_id: batch.id,
              group_id: el.id,
              student_code: item.student_code,
              monitor_code: item.monitor,
            };
          }

          if (item.staff) {
            return {
              batch_id: batch.id,
              group_id: el.id,
              student_code: item.student_code,
              staff_code: item.staff,
            };
          }

          return {
            batch_id: batch.id,
            group_id: el.id,
            student_code: item.student_code,
          };
        });

        return [...total, ...rawData];
      }, []);

      let self_assessment_details = checkedMergeSV.reduce((total, item) => {
        let rawData = question?.data.question_groups.map((el) => {
          return {
            batch_id: batch.id,
            question_group_id: el.id,
            student_code: item.student_code,
          };
        }, []);

        return [...total, ...rawData];
      }, []);

      return await fetch(import.meta.env.VITE_RL_INSERT_SV, {
        method: "POST",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_ADMIN,
          })}`,
        },
        body: JSON.stringify({
          enrollments,
          assessment_groups,
          self_assessment_details,
        }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (
        data.insert_enrollments.affected_rows > 0 ||
        data.insert_assessment_groups.affected_rows > 0 ||
        data.insert_self_assessment_details.affected_rows > 0
      ) {
        queryClient.invalidateQueries({
          queryKey: ["RL_STUDENT_PRESENT"],
        });
        Swal.fire({
          title: `Cập nhật sinh viên thành công!`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Đã có lỗi xảy ra!",
          text: "Vui lòng liên hệ quản trị mạng để khắc phục sự cố",
          icon: "error",
        });
      }
    },
  });

  const handleOnclick = () => {
    Swal.fire({
      title: `Cập nhật ${
        mergeSV.filter((item) => item.isChecked).length
      } sinh viên vào đánh giá rèn luyện`,
      html: `<p>
            Những sinh viên thuộc lớp chưa có lớp trưởng hoặc QLSV sẽ chưa được đánh giá đến khi đã phân công đủ lớp trưởng và QLSV!
          </p>`,
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ bỏ",
      showLoaderOnConfirm: () => !Swal.isLoading(),
      preConfirm: async () => {
        await mutation.mutateAsync();
      },
    });
  };

  useEffect(() => {
    if (mergeSV && mergeSV.length > 0) {
      if (mergeSV.every((item) => item.isChecked)) setCheckAll(true);
      else setCheckAll(false);
    }
  }, [mergeSV]);

  if (studentPresent.isRefetching) {
    return (
      <ReactLoading
        type="spin"
        color="#0083C2"
        width={"30px"}
        height={"30px"}
        className="self-center"
      />
    );
  }

  if (question.isLoading && question.isFetching) {
    return (
      <ReactLoading
        type="spin"
        color="#0083C2"
        width={"30px"}
        height={"30px"}
        className="self-center"
      />
    );
  }

  if (!mergeSV) {
    return (
      <ReactLoading
        type="spin"
        color="#0083C2"
        width={"30px"}
        height={"30px"}
        className="self-center"
      />
    );
  }

  if (mergeSV.length === 0) {
    return (
      <h3 className="text-center">
        Hiện tại không có sinh viên mới để cập nhật
      </h3>
    );
  }

  return (
    <>
      <div className="overflow-x-auto mt-[30px] h-[500px] border-[1px] border-solid border-bordercl rounded-[5px]">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>
                <input
                  type="checkbox"
                  className={`checkbox checkbox-primary`}
                  checked={checkAll}
                  onChange={() => {
                    setCheckAll((pre) => !pre);
                    setMergeSV((pre) =>
                      pre.map((item) => ({
                        ...item,
                        isChecked: checkAll ? false : true,
                      }))
                    );
                  }}
                />
              </th>
              <th>Tên lớp</th>
              <th>Mã sinh viên</th>
              <th>Tên sinh viên</th>
            </tr>
          </thead>
          <tbody>
            {mergeSV.map((item, index) => {
              return (
                <tr key={index} className="hover">
                  <th>{index + 1}</th>
                  <td>
                    <input
                      type="checkbox"
                      className={`checkbox checkbox-primary`}
                      checked={item.isChecked}
                      onChange={() => {
                        // setCheckAll((pre) => !pre);
                        setMergeSV((pre) =>
                          pre.map((el) =>
                            el.student_code === item.student_code
                              ? { ...el, isChecked: !el.isChecked }
                              : el
                          )
                        );
                      }}
                    />
                  </td>
                  <td>{item.class_code}</td>
                  <td>{item.student_code}</td>
                  <td>{item.fullname}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="selfBtn w-fit self-center" onClick={handleOnclick}>
        Cập nhật sinh viên
      </button>
    </>
  );
}
