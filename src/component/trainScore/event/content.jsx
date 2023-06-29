import "../../../App.css";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Select from "react-select";
import SubContent from "./subContent";

export default function Index() {
  const queryClient = useQueryClient();
  //   const listSV = queryClient.getQueryData({ queryKey: ["RL_LIST_SV"] });
  const listEV = queryClient.getQueryData({ queryKey: ["RL_LIST_EV"] });
  const [select, setSelect] = useState(null);
  const [select1, setSelect1] = useState(null);
  return (
    <>
      <div className="w-full flex gap-[10%]">
        <Select
          className="w-[20%]"
          placeholder="Chọn loại sự kiện"
          options={listEV
            .filter((item) => item.event.length > 0)
            .map((item, index) => ({ label: item.name, value: index }))}
          value={select}
          onChange={setSelect}
        />
        {select ? (
          <Select
            className="w-[70%]"
            placeholder="Chọn hình thức"
            options={listEV
              .filter(
                (item, index) =>
                  item.name === select.label || index === select.value
              )
              .reduce(
                (total, curr) => [
                  ...total,
                  ...curr.event.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })),
                ],
                []
              )}
            value={select1}
            onChange={setSelect1}
          />
        ) : (
          <></>
        )}
      </div>
      {select1 ? (
        <>
          <div className="flex flex-col gap-[10px]">
            <h3>Chi tiết sự kiện:</h3>
            <textarea
              className="textarea textarea-bordered border-bordercl resize-none h-[250px]"
              placeholder="Nhập thêm thông tin sự kiện VD: Ngày DD/MM/YYYY tham gia hoạt động xã hội ..."
            ></textarea>
          </div>
          <SubContent />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
