import "../../../App.css";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

export default function Index() {
  const queryClient = useQueryClient();
  const listSV = queryClient.getQueryData({ queryKey: ["RL_LIST_SV"] });
  const [root, setRoot] = useState(null);
  const [data, setData] = useState(null);
  const [select, setSelect] = useState(null);

  useEffect(() => {
    if (listSV)
      setRoot(
        listSV.map((item) => ({
          ...item,
          checkedAll: false,
          listSV: item.listSV.map((el) => ({
            ...el,
            checked: false,
            isSelect: false,
          })),
        }))
      );
  }, []);

  useEffect(() => {
    if (select) {
      //   console.log(root.find((item) => item.class_code === select.label));
      setData(root.find((item) => item.class_code === select.label));
    }
  }, [select, root]);

  // useEffect(() => {
  //   if (root && select)
  //     root
  //       .find((item) => item.class_code === select.label)
  //       .listSV.every((item) => item.checked)
  //       ? setRoot((pre) =>
  //           pre.map((el) =>
  //             el.class_code === select.label
  //               ? {
  //                   ...el,
  //                   checkedAll: true,
  //                 }
  //               : el
  //           )
  //         )
  //       : setRoot((pre) =>
  //           pre.map((el) =>
  //             el.class_code === select.label
  //               ? {
  //                   ...el,
  //                   checkedAll: false,
  //                 }
  //               : el
  //           )
  //         );
  // }, [root]);

  return (
    <div className="flex border-t border-bordercl w-full">
      <div className="w-[45%] p-[10px] flex-col flex gap-[10px]">
        <Select
          className="w-[30%]"
          options={listSV.map((item, index) => ({
            label: item.class_code,
            value: index,
          }))}
          value={select}
          onChange={setSelect}
          placeholder="Chọn lớp"
        />
        {data ? (
          <div className="flex flex-col gap-[10px]">
            <input
              type="checkbox"
              checked={data.checkedAll}
              // isIndeterminate={true}
              onChange={() =>
                setRoot((pre) =>
                  pre.map((el) =>
                    el.class_code === select.label
                      ? {
                          ...el,
                          checkedAll: el.checkedAll ? false : true,
                          listSV: el.listSV.map((subEl) =>
                            // console.log(subEl);
                            // console.log();
                            ({
                              ...subEl,
                              checked: el.checkedAll ? false : true,
                            })
                          ),
                        }
                      : el
                  )
                )
              }
              className="checkbox checkbox-success"
            />
            <div className="flex flex-col gap-[10px] max-h-[300px] h-[300px] overflow-y-scroll">
              {data.listSV
                .filter((item) => !item.isSelect)
                .map((item, index) => (
                  <div className="flex items-center gap-[10px]" key={index}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() =>
                        setRoot((pre) =>
                          pre.map((el) =>
                            el.class_code === select.label
                              ? {
                                  ...el,
                                  checkedAll: el.listSV.every((i) => i.checked)
                                    ? false
                                    : el.listSV
                                        .filter((i) => i.masv !== item.masv)
                                        .every((i) => i.checked)
                                    ? true
                                    : false,
                                  listSV: el.listSV.map((subEl) => {
                                    return subEl.masv === item.masv
                                      ? { ...subEl, checked: !subEl.checked }
                                      : subEl;
                                  }),
                                }
                              : el
                          )
                        )
                      }
                      className="checkbox checkbox-success"
                    />
                    <h3>{item.fullname}</h3>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {data ? (
        <div className="flex flex-col justify-center w-[10%] items-center gap-[20px]">
          <AiOutlineArrowRight
            size={"35px"}
            onClick={() =>
              setRoot((pre) =>
                pre.map((item) => ({
                  ...item,
                  listSV: item.listSV.map((el) => ({
                    ...el,
                    isSelect: el.checked ? true : false,
                  })),
                }))
              )
            }
          />
          <AiOutlineArrowLeft size={"35px"} />
        </div>
      ) : (
        <></>
      )}
      <div className="w-[45%] p-[10px] flex-col flex gap-[10px] ">
        {root ? (
          <div className="flex flex-col gap-[10px]">
            <h3 className="self-center">Danh sách sinh viên đã chọn</h3>
            <div className="flex flex-col gap-[10px] max-h-[340px] h-[340px] overflow-y-scroll">
              {data.listSV
                .filter((item) => item.isSelect)
                .map((item, index) => (
                  <div className="flex items-center gap-[10px]" key={index}>
                    {/* <input
                      type="checkbox"
                      checked={item.checked}
                      className="checkbox checkbox-success"
                    /> */}
                    <h3>{item.fullname}</h3>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
