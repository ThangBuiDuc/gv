import "../../../../App.css";
import { useEffect } from "react";
import Select from "react-select";
import { useState } from "react";
import Swal from "sweetalert2";

// import SubContent from "./subContent";
import { Fragment } from "react";
import { useAuth } from "@clerk/clerk-react";
const role = [
  { value: parseInt(import.meta.env.VITE_ROLE_TEACHER), label: "Giảng viên" },
  {
    value: parseInt(import.meta.env.VITE_ROLE_QLDT),
    label: "Quản lý đào tạo",
  },
  { value: parseInt(import.meta.env.VITE_ROLE_ADMIN), label: "Quản trị" },
];

export default function Index({ data, setData }) {
  // console.log(data);
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState();
  const [search, setSearch] = useState([]);
  const { getToken } = useAuth();
  // const [checked, setChecked] = useState(new Array(search.length).fill(false));
  // console.log(search);

  const handleOnClickRole = () => {
    if (selectedOption) {
      Swal.fire({
        title: "Cập nhật quyền!",
        text: `Bạn có chắc chắn muốn cập nhật lại quyền cho tất cả những người đã được chọn!`,
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Huỷ",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async () => {
          let updates = data
            .filter((item) => item.checked)
            .map((item) => {
              return {
                _set: {
                  role_id: selectedOption.value,
                  updated_at: new Date(),
                },
                where: {
                  code: {
                    _eq: item.code,
                  },
                },
              };
            });

          // console.log(updates);

          // Swal.fire({
          //   title: "Cập nhật quyền thất bại!",
          //   icon: "error",
          // });
          await fetch(import.meta.env.VITE_SURVEY_ROLE_UPDATE, {
            method: "PUT",
            headers: {
              authorization: `Bearer ${await getToken({
                template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
              })}`,
            },
            body: JSON.stringify({ updates }),
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.result.every((item) => item.affected_rows === 1)) {
                setData((pre) =>
                  pre.map((item) => {
                    // console.log(res.result[0].returning[0].code);
                    // console.log(item);
                    if (
                      res.result.some(
                        (el) => el.returning[0].code === item.code
                      )
                    ) {
                      item.role_id = selectedOption.value;
                      item.description = selectedOption.label;
                      item.checked = false;
                    }
                    return item;
                  })
                );
                setSelectedOption(null);
                Swal.fire({
                  title: "Cập nhật quyền thành công!",
                  icon: "success",
                });
              }
              // else if (
              //   res.result.filter((item) => item.affected_rows !== 1)
              // ) {

              //   Swal.fire({
              //     title: `Cập nhật quyền thành công ngoại trừ ${res.result
              //       .filter((item) => item.affected_rows !== 1)
              //       .map((item) => item.returning.name)
              //       .join(", ")}!`,
              //     icon: "warning",
              //   });
              // }
            })
            .catch(() => {
              Swal.fire({
                title: "Cập nhật quyền thất bại!",
                icon: "error",
              });
            });
        },
      });
    } else {
      Swal.fire({
        title: "Vui lòng chọn quyền cần cập nhật!",
        icon: "warning",
      });
    }

    if (!data.some((item) => item.checked)) {
      Swal.fire({
        title: "Vui lòng chọn Cán bộ/Giảng viên cần cập nhật quyền!",
        icon: "warning",
      });
    }
  };

  const handleOnClickTruongKhoa = () => {
    if (!data.some((item) => item.checked)) {
      Swal.fire({
        title: "Vui lòng chọn Cán bộ/Giảng viên cần cập trưởng khoa!",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: `Cập nhật trưởng khoa!`,
        text: `Những người được chọn đã là trưởng khoa trước đó sẽ mất quyền trưởng khoa và NGƯỢC LẠI. Bạn có chắc chắn muốn thực hiện?`,
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Huỷ",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async () => {
          let updates = data
            .filter((item) => item.checked)
            .map((item) => {
              return {
                _set: {
                  is_truong_khoa: item.is_truong_khoa ? false : true,
                  updated_at: new Date(),
                },
                where: {
                  code: {
                    _eq: item.code,
                  },
                },
              };
            });

          // console.log(updates);

          // Swal.fire({
          //   title: "Cập nhật quyền thất bại!",
          //   icon: "error",
          // });
          await fetch(import.meta.env.VITE_SURVEY_ROLE_UPDATE, {
            method: "PUT",
            headers: {
              authorization: `Bearer ${await getToken({
                template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
              })}`,
            },
            body: JSON.stringify({ updates }),
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.result.every((item) => item.affected_rows === 1)) {
                setData((pre) =>
                  pre.map((item) => {
                    // console.log(res.result[0].returning[0].code);
                    // console.log(item);
                    if (
                      res.result.some(
                        (el) => el.returning[0].code === item.code
                      )
                    ) {
                      item.is_truong_khoa = !item.is_truong_khoa;
                      item.checked = false;
                    }
                    return item;
                  })
                );
                Swal.fire({
                  title: "Cập nhật trưởng khoa thành công!",
                  icon: "success",
                });
              }
            })
            .catch(() => {
              Swal.fire({
                title: "Cập nhật trưởng khoa thất bại!",
                icon: "error",
              });
            });
        },
      });
    }
  };

  useEffect(() => {
    if (query !== "")
      setSearch(
        data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    else setSearch(data);
  }, [query, data]);

  // useEffect(()=> {
  //   setChecked([search.length].fill(false))
  // },[search])
  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex justify-between">
        <div className="flex gap-[10px] justify-center items-center">
          <p className="font-semibold h-fit">Quyền:</p>
          <Select
            options={role}
            //   defaultInputValue="Giảng viên"
            value={selectedOption}
            onChange={setSelectedOption}
            className="min-w-[200px]"
            placeholder="Lựa chọn quyền"
          />
          <button className="btn ml-[20px]" onClick={handleOnClickRole}>
            Cập nhật quyền
          </button>
          <button className="btn  ml-[20px]" onClick={handleOnClickTruongKhoa}>
            Thêm/Loại trưởng khoa
          </button>
        </div>
        <input
          type="search"
          placeholder="Nhập thông tin tìm kiếm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-solid border-[1px] border-bordercl text-[18px] rounded-[5px] p-[5px] w-[30%] self-end"
        />
      </div>
      <div className="flex flex-col gap-[50px]">
        {search.length > 0 ? (
          search.map((item, index) => {
            return (
              // <Fragment key={index}>
              //   <SubContent
              //     item={item}
              //     // adminCount={
              //     //   data.filter(
              //     //     (item) =>
              //     //       item.role_id ===
              //     //       parseInt(import.meta.env.VITE_ROLE_ADMIN)
              //     //   ).length
              //     // }
              //     setData={setData}
              //   />
              // </Fragment>
              <Fragment key={index}>
                <div className="flex flex-col gap-[20px]">
                  <div className="flex border-t border-bordercl border-solid pt-[10px]">
                    <h3 className="w-[30%]">
                      {item.ma_hoc_vi === null || item.ma_hoc_vi === "CXD"
                        ? ""
                        : `${item.ma_hoc_vi}. `}
                      {item.name}
                    </h3>
                    <h3 className="w-[40%]">
                      {item.khoa_gv ? item.khoa_gv : "Chưa xác định"}
                      {item.is_truong_khoa ? " - Trưởng khoa" : ""}
                    </h3>
                    <h3 className="w-[20%]">{item.description}</h3>
                    <div className="flex justify-center w-[10%] items-center">
                      <input
                        type="checkbox"
                        className="w-[20%] h-[20px]"
                        checked={item.checked}
                        onChange={() =>
                          setData((pre) =>
                            pre.map((el) => {
                              if (el.code === item.code)
                                el.checked = !el.checked;
                              return el;
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })
        ) : (
          <div className="flex justify-center">
            <h3>Không tìm thấy kết quả</h3>
          </div>
        )}
      </div>
    </div>
  );
}
