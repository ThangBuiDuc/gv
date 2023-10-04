import "../../../../App.css";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useAuth } from "@clerk/clerk-react";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Index() {
  const queryClient = useQueryClient();
  const batch = queryClient.getQueryData(["RL_BATCH"]);
  const { getToken } = useAuth();
  const [mergeClass, setMergeClass] = useState(null);
  const [checkedMergeClass, setCheckedMergeClass] = useState([]);
  const [course, setCourse] = useState(null);
  const [checkAll, setCheckAll] = useState(false);
  const [count, setCount] = useState(0);

  const question = useQuery({
    queryKey: ["RL_QUESTION_GROUPQUESTION"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_QUESTION_GROUPQUESTION).then(
        (res) => res.json()
      );
    },
  });

  const classPresent = useQuery({
    queryKey: ["RL_CLASS_OLD_INIT", { type: batch?.id }],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_RL_OLD_INIT}${batch?.id}`, {
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

  const classOldInit = useQuery({
    queryKey: ["RL_CLASS_OLD_INIT", { type: batch?.id - 1 }],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_OLD_INIT}${batch?.id - 1}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_SUPER_ADMIN,
            })}`,
          },
        }
      ).then((res) => res.json());
      // .then((res) => (res ? res : null));
    },
  });

  const classNewInit = useQuery({
    queryKey: ["RL_CLASS_NEW_INIT"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_EDUMNG_CLASS}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_RL_EDU,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
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
          malop: mergeClass.map((item) => item.class_code),
        }),
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
    },
    enabled: mergeClass !== null,
  });

  useEffect(() => {
    if (
      classNewInit?.data &&
      classOldInit?.data &&
      classPresent?.data &&
      classPresent?.data.classes.length === 0
    ) {
      setMergeClass(
        classNewInit?.data.reduce((total, item, index) => {
          let rawData = classOldInit?.data.classes.find(
            (el) => el.class_code === item.malop
          );
          let staff = classOldInit?.data.qlsv.res.find(
            (el) => el.khoa.makhoa === item.makhoa
          );
          // console.log(staff);
          if (rawData) {
            return [
              ...total,
              {
                stt: index + 1,
                class_code: rawData.class_code,
                monitor: rawData.monitor,
                staff: staff ? staff : null,
                makhoahoc: item.makhoahoc,
                makhoa: item.makhoa,
                isChecked: false,
              },
            ];
          } else
            return [
              ...total,
              {
                stt: index + 1,
                class_code: item.malop,
                makhoahoc: item.makhoahoc,
                makhoa: item.makhoa,
                monitor: null,
                staff: staff ? staff : null,
                isChecked: false,
              },
            ];
        }, [])
      );
    }

    if (
      classNewInit?.data &&
      classOldInit?.data &&
      classPresent?.data &&
      classPresent?.data.classes.length > 0
    ) {
      let rawData = classNewInit?.data.reduce((total, item, index) => {
        let rawData = classOldInit?.data.classes.find(
          (el) => el.class_code === item.malop
        );
        let staff = classOldInit?.data.qlsv.res.find(
          (el) => el.khoa.makhoa === item.makhoa
        );
        if (rawData) {
          return [
            ...total,
            {
              stt: index + 1,
              class_code: rawData.class_code,
              monitor: rawData.monitor,
              staff: staff ? staff : null,
              makhoahoc: item.makhoahoc,
              makhoa: item.makhoa,
              isChecked: false,
            },
          ];
        } else
          return [
            ...total,
            {
              stt: index + 1,
              class_code: item.malop,
              makhoahoc: item.makhoahoc,
              monitor: null,
              makhoa: item.makhoa,
              staff: staff ? staff : null,
              isChecked: false,
            },
          ];
      }, []);
      setMergeClass(
        // classNewInit?.data.reduce((total, item, index) => {
        //   if (
        //     classPresent?.data.classes.some(
        //       (el) => el.class_code === item.malop
        //     )
        //   ) {
        //     return total;
        //   } else {
        //     return [
        //       ...total,
        //       {
        //         stt: index + 1,
        //         class_code: item.malop,
        //         monitor: null,
        //         staff: null,
        //         makhoahoc: item.makhoahoc,
        //         isChecked: false,
        //       },
        //     ];
        //   }
        // }, [])

        rawData.reduce((total, item) => {
          if (
            classPresent?.data.classes.some(
              (el) => el.class_code === item.class_code
            )
          )
            return total;
          else {
            if (
              classPresent?.data.qlsv.res.find(
                (el) => item.makhoa === el.khoa.makhoa
              ) &&
              item.staff !==
                classPresent?.data.qlsv.res.find(
                  (el) => item.makhoa === el.khoa.makhoa
                ).staff
            )
              return [
                ...total,
                {
                  ...item,
                  staff: classPresent?.data.qlsv.res.find(
                    (el) => item.makhoa === el.khoa.makhoa
                  ),
                },
              ];
            else return [...total, item];
          }
        }, [])
      );
    }
  }, [classNewInit?.data, classPresent?.data, classOldInit?.data]);

  useEffect(() => {
    if (mergeClass && mergeClass.length > 0 && count === 0) {
      setCourse(
        // mergeClass.reduce((total, item) => {
        //   let str = item.class_code.match(/\d+/g)[0].slice(0, 2);
        //   if (total.find((el) => el === str)) {
        //     return total;
        //   } else {
        //     console.log(str);
        //     return [...total, str];
        //   }
        // }, [])
        [...new Set(mergeClass.map((item) => item.makhoahoc))].map((item) => ({
          khoa: item,
          isChecked: false,
        }))
      );
      setCount((pre) => pre + 1);
    }

    if (mergeClass && mergeClass.length > 0) {
      setCheckedMergeClass(mergeClass.filter((item) => item.isChecked));
    }
  }, [mergeClass]);

  useEffect(() => {
    if (
      mergeClass &&
      mergeClass.length > 0 &&
      mergeClass.every((item) => item.isChecked)
    ) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  }, [mergeClass]);

  const mutation = useMutation({
    mutationFn: async () => {
      let checkedListSV = listSV?.data.reduce((total, item) => {
        if (checkedMergeClass.some((el) => item.malop === el.class_code))
          return [...total, item];
        else return total;
      }, []);

      let classes = checkedMergeClass.map((item) => {
        if (item.staff && item.monitor) {
          return {
            class_code: item.class_code,
            monitor: item.monitor.masv,
            staff: item.staff.staff,
            batch_id: batch.id,
            ma_khoa: item.makhoa,
          };
        }

        if (item.staff) {
          return {
            class_code: item.class_code,
            staff: item.staff.staff,
            batch_id: batch.id,
            ma_khoa: item.makhoa,
          };
        }

        if (item.monitor) {
          return {
            class_code: item.class_code,
            monitor: item.monitor.masv,
            batch_id: batch.id,
            ma_khoa: item.makhoa,
          };
        }
        return {
          class_code: item.class_code,
          batch_id: batch.id,
          ma_khoa: item.makhoa,
        };
      });
      let enrollments = checkedListSV.map((item) => {
        let check = checkedMergeClass.find(
          (el) => el.class_code === item.malop
        );
        return {
          batch_id: batch.id,
          class_code: item.malop,
          student_code: item.masv,
          status: check.monitor === null || check.staff === null ? false : true,
        };
      });

      let assessment_groups = checkedListSV.reduce((total, item) => {
        let check = checkedMergeClass.find(
          (el) => el.class_code === item.malop
        );
        let rawData = question?.data.groups.reduce((rawTotal, el) => {
          if (check.monitor && check.staff) {
            return [
              ...rawTotal,
              {
                batch_id: batch.id,
                group_id: el.id,
                student_code: item.masv,
                monitor_code: check.monitor.masv,
                staff_code: check.staff.magiaovien,
              },
            ];
          }

          if (check.monitor) {
            return [
              ...rawTotal,
              {
                batch_id: batch.id,
                group_id: el.id,
                student_code: item.masv,
                monitor_code: check.monitor.masv,
              },
            ];
          }

          if (check.staff) {
            return [
              ...rawTotal,
              {
                batch_id: batch.id,
                group_id: el.id,
                student_code: item.masv,
                staff_code: check.staff.magiaovien,
              },
            ];
          }

          return [
            ...rawTotal,
            {
              batch_id: batch.id,
              group_id: el.id,
              student_code: item.masv,
            },
          ];
        }, []);

        return [...total, ...rawData];
      }, []);

      let self_assessment_details = checkedListSV.reduce((total, item) => {
        let rawData = question?.data.question_groups.reduce((rawTotal, el) => {
          return [
            ...rawTotal,
            {
              batch_id: batch.id,
              question_group_id: el.id,
              student_code: item.masv,
            },
          ];
        }, []);

        return [...total, ...rawData];
      }, []);

      return await fetch(import.meta.env.VITE_RL_INIT_SV_CLASS, {
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
          classes,
        }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (
        data.insert_enrollments.affected_rows > 0 ||
        data.insert_assessment_groups.affected_rows > 0 ||
        data.insert_self_assessment_details.affected_rows > 0 ||
        data.insert_classes.affected_rows > 0
      ) {
        setCount(0);
        queryClient.invalidateQueries({
          queryKey: ["RL_CLASS_OLD_INIT", { type: batch?.id }],
        });
        Swal.fire({
          title: `Cập nhật lớp thành công!`,
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
      title: `Cập nhật ${checkedMergeClass.length} lớp hành chính vào đánh giá rèn luyện`,
      html: `<p>
            Những lớp  chưa có lớp trưởng hoặc QLSV sẽ chưa được đánh giá đến khi đã phân công đủ lớp trưởng và QLSV!
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

  // if (classPresent.isLoading && classPresent.isFetching) {
  //   return (
  //     <ReactLoading
  //       type="spin"
  //       color="#0083C2"
  //       width={"30px"}
  //       height={"30px"}
  //       className="self-center"
  //     />
  //   );
  // }

  if (classPresent.isRefetching) {
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

  if (!mergeClass) {
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

  if (mergeClass.length === 0) {
    return (
      <h3 className="text-center">
        Hiện tại không có lớp hành chính mới để cập nhật
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
                    setCourse((pre) =>
                      pre.map((item) => ({
                        ...item,
                        isChecked: checkAll ? false : true,
                      }))
                    );
                    setMergeClass((pre) =>
                      pre.map((item) => ({
                        ...item,
                        isChecked: checkAll ? false : true,
                      }))
                    );
                  }}
                />
              </th>
              <th>Tên lớp</th>
              <th>Cán bộ lớp</th>
              <th>Quản lý sinh viên</th>
            </tr>
          </thead>
          <tbody>
            {course &&
              course.map((item, index) => {
                let rawClass = mergeClass.reduce(
                  (total, elm) =>
                    elm.makhoahoc === item.khoa ? [...total, elm] : total,
                  []
                );
                return (
                  <Fragment key={index}>
                    <tr>
                      <th></th>
                      <td>
                        <input
                          type="checkbox"
                          className={`checkbox checkbox-primary`}
                          checked={item.isChecked}
                          onChange={() => {
                            setCourse((pre) =>
                              pre.map((el1) =>
                                el1.khoa === item.khoa
                                  ? {
                                      ...el1,
                                      isChecked: item.isChecked ? false : true,
                                    }
                                  : el1
                              )
                            );
                            setMergeClass((pre) =>
                              pre.map((el2) =>
                                el2.makhoahoc === item.khoa
                                  ? {
                                      ...el2,
                                      isChecked: item.isChecked ? false : true,
                                    }
                                  : el2
                              )
                            );
                          }}
                        />
                      </td>
                      <td colSpan={3}>
                        <h3 className="font-semibold">KHOÁ {item.khoa}</h3>
                      </td>
                    </tr>
                    {rawClass.map((el3) => {
                      return (
                        <tr key={el3.class_code} className="hover">
                          <th></th>
                          <td>
                            <input
                              type="checkbox"
                              className={`checkbox checkbox-primary`}
                              checked={el3.isChecked}
                              onChange={() => {
                                setMergeClass((pre) =>
                                  pre.map((el4) =>
                                    el4.class_code === el3.class_code
                                      ? { ...el4, isChecked: !el4.isChecked }
                                      : el4
                                  )
                                );
                                if (
                                  rawClass
                                    .filter(
                                      (item) =>
                                        item.class_code !== el3.class_code
                                    )
                                    .every((item) => item.isChecked) &&
                                  !el3.isChecked
                                ) {
                                  setCourse((pre) =>
                                    pre.map((item) =>
                                      item.khoa === el3.makhoahoc
                                        ? { ...item, isChecked: true }
                                        : item
                                    )
                                  );
                                }

                                if (rawClass.every((item) => item.isChecked)) {
                                  setCourse((pre) =>
                                    pre.map((item) =>
                                      item.khoa === el3.makhoahoc
                                        ? { ...item, isChecked: false }
                                        : item
                                    )
                                  );
                                }
                              }}
                            />
                          </td>
                          <td>{el3.class_code}</td>
                          <td>
                            {el3.monitor ? el3.monitor.fullname : ""}
                            {el3.monitor ? (
                              <>
                                <br />
                                <span className="badge badge-ghost badge-sm">
                                  {el3.monitor.masv}
                                </span>
                              </>
                            ) : (
                              ". . ."
                            )}
                          </td>
                          <td>
                            {el3.staff ? el3.staff.gv.fullname : ""}
                            {el3.staff ? (
                              <>
                                <br />
                                <span className="badge badge-ghost badge-sm">
                                  {el3.staff.staff}
                                </span>
                              </>
                            ) : (
                              ". . ."
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}

            {/* {mergeClass.map((item, index) => {
              return (
                <tr key={index} className="hover">
                  <th>{index + 1}</th>
                  <td>{item.class_code}</td>
                  <td>
                    {item.monitor ? item.monitor.fullname : ""}
                    {item.monitor ? (
                      <>
                        <br />
                        <span className="badge badge-ghost badge-sm">
                          {item.monitor.masv}
                        </span>
                      </>
                    ) : (
                      ". . ."
                    )}
                  </td>
                  <td>
                    {item.staff ? item.staff.fullname : ""}
                    {item.staff ? (
                      <>
                        <br />
                        <span className="badge badge-ghost badge-sm">
                          {item.staff.staff}
                        </span>
                      </>
                    ) : (
                      ". . ."
                    )}
                  </td>
                </tr>
              );
            })} */}
          </tbody>
        </table>
      </div>
      {checkedMergeClass.length > 0 ? (
        <button className="selfBtn w-fit self-center" onClick={handleOnclick}>
          Cập nhật lớp hành chính
        </button>
      ) : (
        <button className="disableBtn w-fit self-center">
          Cập nhật lớp hành chính
        </button>
      )}
    </>
  );
}
