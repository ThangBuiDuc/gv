// import React from 'react'
import "../../../App.css";
import Select from "react-select";
import { useState } from "react";
// import { useAuth } from "@clerk/clerk-react";
import Swal from "sweetalert2";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Index({ staff, data, question, present }) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  // console.log(present);
  // const select =
  const select = staff
    .map((item) => {
      return {
        khoa_gv: item.khoa_gv,
        ten_hoc_vi: item.ten_hoc_vi,
        value: item.code,
        label: item.name,
      };
    })
    .filter((item) => item.value !== data.teacher_code);

  // console.log(select);
  // const select = [
  //   {
  //     value: 'quangnguyez91n xuaz93n(thiz3nhgiaz3ng)',
  //     label : 'Nguyễn Xuân Quang'
  //   }
  // ]
  // console.log(data)
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  // const {getToken} = useAuth();
  // const {user} = useUser();

  const handleOnClick = async () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn phần công dự giờ cho môn học không?",
      showConfirmButton: true,
      confirmButtonText: "Xác nhận",
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        let _set = {
          teacher_attend_1: selectedOption.value,
          teacher_attend_2: selectedOption1.value,
          teacher_attend_3: selectedOption2.value,
          updated_at: new Date(),
        };

        let where = {
          hocky: {
            _eq: present.hocky,
          },
          namhoc: {
            _eq: present.manamhoc,
          },
          subject_code: {
            _eq: data.subject_code,
          },
          class_code: {
            _eq: data.class_code,
          },
        };

        let objects = [
          {
            class_code: data.class_code,
            subject_code: data.subject_code,
            user_code: selectedOption.value,
            hocky: present.hocky,
            namhoc: present.manamhoc,
            end_date: data.end_date,
          },
          {
            class_code: data.class_code,
            subject_code: data.subject_code,
            user_code: selectedOption1.value,
            hocky: present.hocky,
            namhoc: present.manamhoc,
            end_date: data.end_date,
          },
          {
            class_code: data.class_code,
            subject_code: data.subject_code,
            user_code: selectedOption2.value,
            hocky: present.hocky,
            namhoc: present.manamhoc,
            end_date: data.end_date,
          },
        ];

        let objects1 = question.reduce((total, curr) => {
          let item = [
            {
              question_id: curr.question_id,
              subject_code: data.subject_code,
              class_code: data.class_code,
              user_code: selectedOption.value,
              hocky: present.hocky,
              namhoc: present.manamhoc,
              end_date: data.end_date,
            },
            {
              question_id: curr.question_id,
              subject_code: data.subject_code,
              class_code: data.class_code,
              user_code: selectedOption1.value,
              hocky: present.hocky,
              namhoc: present.manamhoc,
              end_date: data.end_date,
            },
            {
              question_id: curr.question_id,
              subject_code: data.subject_code,
              class_code: data.class_code,
              user_code: selectedOption2.value,
              hocky: present.hocky,
              namhoc: present.manamhoc,
              end_date: data.end_date,
            },
          ];
          return [...total, ...item];
        }, []);

        const result = await fetch(
          `${import.meta.env.VITE_ASSIGNED_TEACHER_API}`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${await getToken({
                template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
              })}`,
            },
            body: JSON.stringify({
              _set,
              where,
              objects,
              objects1,
            }),
          }
        ).then((res) => res.status);

        if (result === 200) {
          queryClient.invalidateQueries({ queryKey: ["getData_assign_CTGD"] });
          Swal.fire({ title: "Phân công dự giờ thành công!", icon: "success" });
        } else
          Swal.fire({
            title: "Phân công dự giờ không thành công",
            icon: "error",
          });
      },
    });
  };
  // console.log(selectedOption);
  return (
    <>
      <div className="md:flex-row flex-col flex gap-[10px] justify-between">
        {data.teacher_attend_1 ? (
          <></>
        ) : (
          <Select
            className="min-w-[20%]"
            placeholder={"Chủ tịch HĐ"}
            noOptionsMessage={() => "Không tìm thấy kết quả"}
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={
              selectedOption1 && selectedOption2
                ? select
                    .filter((item) => item.value !== selectedOption1.value)
                    .filter((item) => item.value !== selectedOption2.value)
                : selectedOption1
                ? select.filter((item) => item.value !== selectedOption1.value)
                : selectedOption2
                ? select.filter((item) => item.value !== selectedOption2.value)
                : select
            }
          />
        )}
        {data.teacher_attend_2 ? (
          <></>
        ) : (
          <Select
            className="min-w-[20%]"
            noOptionsMessage={() => "Không tìm thấy kết quả"}
            placeholder={"Thư ký"}
            defaultValue={selectedOption1}
            onChange={setSelectedOption1}
            options={
              selectedOption && selectedOption2
                ? select
                    .filter((item) => item.value !== selectedOption.value)
                    .filter((item) => item.value !== selectedOption2.value)
                : selectedOption
                ? select.filter((item) => item.value !== selectedOption.value)
                : selectedOption2
                ? select.filter((item) => item.value !== selectedOption2.value)
                : select
            }
          />
        )}
        {data.teacher_attend_3 ? (
          <></>
        ) : (
          <Select
            className="min-w-[20%]"
            noOptionsMessage={() => "Không tìm thấy kết quả"}
            placeholder={"Uỷ viên"}
            defaultValue={selectedOption2}
            onChange={setSelectedOption2}
            options={
              selectedOption && selectedOption1
                ? select
                    .filter((item) => item.value !== selectedOption.value)
                    .filter((item) => item.value !== selectedOption1.value)
                : selectedOption
                ? select.filter((item) => item.value !== selectedOption.value)
                : selectedOption1
                ? select.filter((item) => item.value !== selectedOption1.value)
                : select
            }
          />
        )}
      </div>
      {selectedOption ? (
        <div className="lg1:flex-row flex-col flex gap-[5%] justify-between">
          <p className="lg:w-[35%] w-full">
            Chủ tịch hội đồng:{" "}
            <span className="font-semibold">{selectedOption.label}</span>
          </p>
          <p className="lg:w-[25%] w-full">
            Học vị:{" "}
            <span className="font-semibold">{selectedOption.ten_hoc_vi}</span>
          </p>
          <p className="lg:w-[25%] w-full text-left">
            Khoa:{" "}
            <span className="font-semibold">{selectedOption.khoa_gv}</span>
          </p>
        </div>
      ) : data.teacher_attend_1 ? (
        <div className="lg1:flex-row flex-col flex gap-[5%] justify-between">
          <p className="lg:w-[35%] w-full">
            Chủ tịch hội đồng:{" "}
            <span className="font-semibold">
              {staff.find((item) => item.code === data.teacher_attend_1).name}
            </span>
          </p>
          <p className="lg:w-[25%] w-full">
            Học vị:{" "}
            <span className="font-semibold">
              {
                staff.find((item) => item.code === data.teacher_attend_1)
                  .ten_hoc_vi
              }
            </span>
          </p>
          <p className="lg:w-[25%] w-full text-left">
            Khoa:{" "}
            <span className="font-semibold">
              {
                staff.find((item) => item.code === data.teacher_attend_1)
                  .khoa_gv
              }
            </span>
          </p>
        </div>
      ) : (
        <></>
      )}
      {selectedOption1 ? (
        <div className="lg1:flex-row flex-col flex gap-[5%] justify-between">
          <p className="lg:w-[35%] w-full">
            Thư ký:{" "}
            <span className="font-semibold">{selectedOption1.label}</span>
          </p>
          <p className="lg:w-[25%] w-full">
            Học vị:{" "}
            <span className="font-semibold">{selectedOption1.ten_hoc_vi}</span>
          </p>
          <p className="lg:w-[25%] w-full text-left">
            Khoa:{" "}
            <span className="font-semibold">{selectedOption1.khoa_gv}</span>
          </p>
        </div>
      ) : data.teacher_attend_2 ? (
        <div className="lg1:flex-row flex-col flex gap-[5%] justify-between">
          <p className="lg:w-[35%] w-full">
            Thư ký:{" "}
            <span className="font-semibold">
              {staff.find((item) => item.code === data.teacher_attend_2).name}
            </span>
          </p>
          <p className="lg:w-[25%] w-full">
            Học vị:{" "}
            <span className="font-semibold">
              {
                staff.find((item) => item.code === data.teacher_attend_2)
                  .ten_hoc_vi
              }
            </span>
          </p>
          <p className="lg:w-[25%] w-full text-left">
            Khoa:{" "}
            <span className="font-semibold">
              {
                staff.find((item) => item.code === data.teacher_attend_2)
                  .khoa_gv
              }
            </span>
          </p>
        </div>
      ) : (
        <></>
      )}
      {selectedOption2 ? (
        <div className="lg1:flex-row flex-col flex gap-[5%] justify-between">
          <p className="lg:w-[35%] w-full">
            Uỷ viên:{" "}
            <span className="font-semibold">{selectedOption2.label}</span>
          </p>
          <p className="lg:w-[25%] w-full">
            Học vị:{" "}
            <span className="font-semibold">{selectedOption2.ten_hoc_vi}</span>
          </p>
          <p className="lg:w-[25%] w-full text-left">
            Khoa:{" "}
            <span className="font-semibold">{selectedOption2.khoa_gv}</span>
          </p>
        </div>
      ) : data.teacher_attend_3 ? (
        <div className="lg1:flex-row flex-col flex gap-[5%] justify-between">
          <p className="lg:w-[35%] w-full">
            Uỷ viên:{" "}
            <span className="font-semibold">
              {staff.find((item) => item.code === data.teacher_attend_3).name}
            </span>
          </p>
          <p className="lg:w-[25%] w-full">
            Học vị:{" "}
            <span className="font-semibold">
              {
                staff.find((item) => item.code === data.teacher_attend_3)
                  .ten_hoc_vi
              }
            </span>
          </p>
          <p className="lg:w-[25%] w-full text-left">
            Khoa:{" "}
            <span className="font-semibold">
              {
                staff.find((item) => item.code === data.teacher_attend_3)
                  .khoa_gv
              }
            </span>
          </p>
        </div>
      ) : (
        <></>
      )}
      {data.teacher_attend_1 &&
      data.teacher_attend_2 &&
      data.teacher_attend_3 ? (
        <></>
      ) : selectedOption && selectedOption1 && selectedOption2 ? (
        <button
          className="btn w-fit self-center"
          onClick={() => handleOnClick()}
        >
          Mời dự giờ
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
