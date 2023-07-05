import "../../../../App.css";
import { useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";

export default function Index() {
  const queryClient = useQueryClient();

  const present = queryClient.getQueryData({ queryKey: ["getPresent_CTGD"] });
  return (
    <div className="flex flex-col [&>h3]:mb-[10px]">
      <h3 className="text-primary">Kỳ hiện tại:</h3>
      <div className="flex justify-evenly items-center">
        <p>
          <span className="font-semibold">Học kỳ:&nbsp;</span>
          {present[0].hocky}
        </p>

        <p>
          <span className="font-semibold">Năm học:&nbsp;</span>
          {present[0].manamhoc}
        </p>
        {/* 
        <p>
          <span className="font-semibold">Ngày bắt đầu:&nbsp;</span>
          <input
            type="date"
            className="rounded-[10px] overflow-hidden border-[1px] border-bordercl border-solid pl-[5px] pr-[5px]"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
          />
        </p>

        <p>
          <span className="font-semibold">Ngày kết thúc:&nbsp;</span>
          <input
            type="date"
            className="rounded-[10px] overflow-hidden border-[1px] border-bordercl border-solid pl-[5px] pr-[5px]"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
          />
        </p> */}
      </div>
    </div>
  );
}
