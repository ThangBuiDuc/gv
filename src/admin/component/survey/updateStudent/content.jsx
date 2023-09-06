import "../../../../App.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function Index() {
  const queryClient = useQueryClient();
  const present = queryClient.getQueryData(["getPresent_CTGD"]);
  const { getToken } = useAuth();
  const [mergeSV, setMergeSV] = useState(null);
  const [checkAll, setCheckAll] = useState(false);

  const svQuestion = useQuery({
    queryKey: ["CTGD_SV_QUESTION"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_SV_BATCH_QUESTION_API}${present.hocky}/${
          present.manamhoc
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
    },
  });

  const listSV_HK = useQuery({
    queryKey: ["CTGD_LIST_SV_HK"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_SURVEY_LIST_SV_HK}${present.hocky}/${
          present.manamhoc
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
            })}`,
          },
        }
      ).then((res) => res.json());
    },
  });

  const listSVCourseEDU = useQuery({
    queryKey: ["EDU_LIST_SV_COURSE"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_EDUMNG_SV_LOP_MON_HOC, {
        method: "POST",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_EDU_CTGD,
          })}`,
        },
        body: JSON.stringify({
          malop: listSV_HK?.data.course.map((item) => item.class_code),
        }),
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
    },
    enabled: listSV_HK?.data !== null && listSV_HK?.data !== undefined,
  });

  useEffect(() => {
    if (listSVCourseEDU?.data && listSVCourseEDU?.data.length > 0) {
      setMergeSV(
        listSVCourseEDU?.data.reduce((total, item) => {
          if (
            listSV_HK?.data.course_respond.some(
              (el) =>
                el.class_code === item.malop &&
                el.subject_code === item.mamonhoc &&
                el.user_code === item.masinhvien
            )
          ) {
            return total;
          } else {
            let course = listSV_HK?.data.course.find(
              (el) =>
                el.class_code === item.malop &&
                el.subject_code === item.mamonhoc
            );
            return [
              ...total,
              {
                isChecked: false,
                malop: item.malop,
                mamonhoc: item.mamonhoc,
                tenmonhoc: course.class_name,
                gv: course.teacher_name,
                khoa: course.ten_khoa,
                masv: item.masinhvien,
                tensv: item.hoten,
                ngayketthuc: item.ngayketthuc,
              },
            ];
          }
        }, [])
      );
    }
  }, [listSV_HK?.data, listSVCourseEDU?.data]);

  useEffect(() => {
    if (
      mergeSV &&
      mergeSV.length > 0 &&
      mergeSV.every((item) => item.isChecked)
    ) {
      setCheckAll(true);
    } else setCheckAll(false);
  }, [mergeSV]);

  const mutation = useMutation({
    mutationFn: async () => {
      let checkedListSV = mergeSV.filter((item) => item.isChecked);

      let users = checkedListSV.map((item) => ({
        role_id: parseInt(import.meta.env.VITE_ROLE_SV),
        name: item.tensv,
        code: item.masv,
      }));

      let course_respond = checkedListSV.map((item) => ({
        class_code: item.malop,
        subject_code: item.mamonhoc,
        user_code: item.masv,
        hocky: present.hocky,
        namhoc: present.manamhoc,
        end_date: item.ngayketthuc,
      }));

      let user_respond_detail = checkedListSV.reduce((total, item) => {
        let rawData = svQuestion?.data.reduce((total, el) => {
          return [
            ...total,
            {
              class_code: item.malop,
              subject_code: item.mamonhoc,
              user_code: item.masv,
              hocky: present.hocky,
              namhoc: present.manamhoc,
              question_id: el.question_id,
            },
          ];
        }, []);
        return [...total, ...rawData];
      }, []);

      return await fetch(import.meta.env.VITE_SURVEY_SV_UPDATE, {
        method: "POST",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
        body: JSON.stringify({
          course_respond,
          user_respond_detail,
          users,
        }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (
        data.insert_course_respond.affected_rows > 0 ||
        data.insert_user_respond_detail.affected_rows > 0
      ) {
        queryClient.invalidateQueries({
          queryKey: ["CTGD_LIST_SV_HK"],
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
      } sinh viên vào đánh giá công tác giảng dạy`,
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

  if (
    (svQuestion.isLoading && svQuestion.isFetching) ||
    (listSV_HK.isLoading && listSV_HK.isFetching) ||
    (listSVCourseEDU.isLoading && listSVCourseEDU.isFetching)
  ) {
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

  if (listSVCourseEDU?.data && listSVCourseEDU?.data.length === 0) {
    return (
      <h3 className="text-center">Vui lòng cập nhật lớp môn học trước!</h3>
    );
  }

  if (mergeSV === null) {
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

  console.log(mergeSV);

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
              <th>Mã lớp</th>
              <th>Môn học</th>
              <th>Giáo viên</th>
              <th>Sinh viên</th>
            </tr>
          </thead>
          <tbody>
            {mergeSV.map((item, index) => {
              return (
                <tr key={item.mamonhoc}>
                  <td className="font-semibold">{index + 1}</td>
                  <td>
                    <input
                      type="checkbox"
                      className={`checkbox checkbox-primary`}
                      checked={item.isChecked}
                      onChange={() => {
                        setMergeSV((pre) =>
                          pre.map((el) =>
                            el.malop === item.malop &&
                            el.mamonhoc === item.mamonhoc &&
                            el.masv === item.masv
                              ? { ...el, isChecked: !el.isChecked }
                              : el
                          )
                        );
                      }}
                    />
                  </td>
                  <td>{item.malop}</td>
                  <td>
                    {item.tenmonhoc}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {item.mamonhoc}
                    </span>
                  </td>
                  <td>
                    {item.gv}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {item.khoa}
                    </span>
                  </td>
                  <td>
                    {item.tensv}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {item.masv}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {mergeSV.some((item) => item.isChecked) ? (
        <button className="selfBtn w-fit self-center" onClick={handleOnclick}>
          Cập nhật lớp môn học
        </button>
      ) : (
        <button className="disableBtn w-fit self-center">
          Cập nhật lớp môn học
        </button>
      )}
    </>
  );
}
