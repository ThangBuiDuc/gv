import "../../../../App.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

export default function Index() {
  const queryClient = useQueryClient();
  const present = queryClient.getQueryData(["getPresent_CTGD"]);
  const { getToken } = useAuth();
  const [mergeCourse, setMergeCourse] = useState(null);
  const [checkAll, setCheckAll] = useState(false);

  const listGv = useQuery({
    queryKey: ["CTGD_LIST_GV"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_LIST_CB_GV, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res.result.length > 0 ? res.result : null));
    },
  });

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

  const course = useQuery({
    queryKey: ["CTGD_COURSE"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_SUBJECT_API}${present.hocky}/${
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

  const courseEDU = useQuery({
    queryKey: ["EDU_course"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_EDUMNG_LOP_MON_HOC, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_EDU_CTGD,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
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
          malop: mergeCourse.map((item) => item.malop),
        }),
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
    },
    enabled: mergeCourse !== null,
  });

  useEffect(() => {
    if (course?.data === null && courseEDU?.data) {
      setMergeCourse(
        courseEDU?.data.map((item, index) => ({
          ...item,
          isChecked: false,
          stt: index + 1,
        }))
      );
    }
    if (course?.data && courseEDU?.data) {
      setMergeCourse(
        courseEDU?.data.reduce((total, item, index) => {
          if (
            course?.data.some(
              (el) =>
                el.class_code === item.malop &&
                el.subject_code === item.mamonhoc
            )
          ) {
            return total;
          } else
            return [...total, { ...item, isChecked: false, stt: index + 1 }];
        }, [])
      );
    }
  }, [course?.data, courseEDU?.data]);

  useEffect(() => {
    if (mergeCourse) {
      if (
        mergeCourse
          .filter((item) => item.magiaovien)
          .every((item) => item.isChecked) &&
        mergeCourse.filter((item) => item.magiaovien).length > 0
      )
        setCheckAll(true);
      else setCheckAll(false);
    }
  }, [mergeCourse]);

  //   console.log(course?.data);
  //   console.log(courseEDU?.data);

  //   console.log(mergeCourse);
  //   console.log(svQuestion?.data);
  //   console.log(listSVCourseEDU?.data);
  const mutation = useMutation({
    mutationFn: async () => {
      let checkedCourse = mergeCourse.filter((item) => item.isChecked);

      let checkedListSV = listSVCourseEDU?.data.reduce((total, item) => {
        if (
          checkedCourse.some(
            (el) => item.malop === el.malop && item.mamonhoc === el.mamonhoc
          )
        )
          return [...total, item];
        else return total;
      }, []);

      let users = [
        ...checkedListSV.map((item) => ({
          role_id: parseInt(import.meta.env.VITE_ROLE_SV),
          class: item.lop,
          code: item.masinhvien,
          name: item.hoten,
        })),
        ...checkedCourse.map((item) => ({
          role_id: parseInt(import.meta.env.VITE_ROLE_TEACHER),
          code: item.magiaovien ? item.magiaovien : item.selectGV.code,
          name: item.tengiaovien ? item.tengiaovien : item.selectGV.name,
          khoa_gv: item.tenkhoa ? item.tenkhoa : item.selectGV.khoa_gv,
        })),
      ];

      let course = checkedCourse.map((item) => ({
        hocky: present.hocky,
        namhoc: present.manamhoc,
        class_name: item.tenmonhoc,
        class_code: item.malop,
        subject_code: item.mamonhoc,
        ten_khoa: item.tenkhoa ? item.tenkhoa : item.selectGV.khoa_gv,
        teacher_code: item.magiaovien ? item.magiaovien : item.selectGV.code,
        total_student: item.siso,
        start_date: item.ngaybatdau,
        end_date: item.ngayketthuc,
        sotc: item.sotc,
      }));

      let course_respond = checkedListSV.map((item) => ({
        class_code: item.malop,
        subject_code: item.mamonhoc,
        user_code: item.masinhvien,
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
              user_code: item.masinhvien,
              hocky: present.hocky,
              namhoc: present.manamhoc,
              question_id: el.question_id,
            },
          ];
        }, []);
        return [...total, ...rawData];
      }, []);

      return await fetch(import.meta.env.VITE_SURVEY_COURSE_UPDATE, {
        method: "POST",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
        body: JSON.stringify({
          course,
          course_respond,
          user_respond_detail,
          users,
        }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (
        data.insert_course.affected_rows > 0 ||
        data.insert_course_respond.affected_rows > 0 ||
        data.insert_user_respond_detail.affected_rows > 0
      ) {
        queryClient.invalidateQueries({
          queryKey: ["CTGD_COURSE"],
        });
        Swal.fire({
          title: `Cập nhật lớp môn học thành công!`,
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
        mergeCourse.filter((item) => item.isChecked).length
      } lớp môn học vào đánh giá công tác giảng dạy`,
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

  // console.log(listGv.data);

  if (listGv.isLoading || listGv.isFetching) {
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

  if (listSVCourseEDU.isLoading && listSVCourseEDU.isFetching) {
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

  if (mergeCourse === null) {
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

  if (mergeCourse.length === 0) {
    return (
      <h3 className="text-center">
        Hiện tại không có lớp môn học mới để cập nhật
      </h3>
    );
  }

  console.log(mergeCourse);

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
                    setMergeCourse((pre) =>
                      pre.map((item) =>
                        item.magiaovien
                          ? {
                              ...item,
                              isChecked: checkAll ? false : true,
                            }
                          : item
                      )
                    );
                  }}
                />
              </th>
              <th>Mã lớp</th>
              <th>Mã môn</th>
              <th>Tên môn</th>
              <th>Số tín chỉ</th>
              <th>Giáo viên</th>
              <th>Sĩ Số</th>
            </tr>
          </thead>
          <tbody>
            {mergeCourse.map((item, index) => {
              return (
                <tr key={item.malop}>
                  <td className="font-semibold">{index + 1}</td>
                  <td>
                    <div
                      className={`${
                        item.magiaovien || item.selectGV
                          ? ""
                          : "tooltip tooltip-right"
                      }`}
                      data-tip="Lớp môn học không đủ điều kiện"
                    >
                      {item.magiaovien || item.selectGV ? (
                        <input
                          type="checkbox"
                          className={`checkbox checkbox-primary`}
                          checked={item.isChecked}
                          onChange={() => {
                            setMergeCourse((pre) =>
                              pre.map((el) =>
                                el.malop === item.malop &&
                                el.mamonhoc === item.mamonhoc
                                  ? { ...el, isChecked: !el.isChecked }
                                  : el
                              )
                            );
                          }}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          className={`checkbox checkbox-primary`}
                          disabled
                        />
                      )}
                    </div>
                  </td>
                  <td>{item.malop}</td>
                  <td>{item.mamonhoc}</td>
                  <td>{item.tenmonhoc}</td>
                  <td>{item.sotc}</td>
                  {item.magiaovien ? (
                    <td>
                      {item.tengiaovien}
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        {item.magiaovien}
                      </span>
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        {item.tenkhoa}
                      </span>
                    </td>
                  ) : (
                    <td>
                      <Select
                        options={listGv?.data.map((item) => ({
                          ...item,
                          value: item.code,
                          label: `${item.name} - ${item.code}`,
                        }))}
                        value={item.selectGV}
                        onChange={(e) => {
                          setMergeCourse((pre) =>
                            pre.map((el) =>
                              el.malop === item.malop &&
                              el.mamonhoc === item.mamonhoc
                                ? { ...el, selectGV: e }
                                : el
                            )
                          );
                        }}
                        className="w-[300px]"
                        placeholder="Lựa chọn giảng viên"
                      />
                    </td>
                  )}
                  <td>{item.siso}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {mergeCourse.some((item) => item.isChecked) ? (
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
