import { IconContext } from "react-icons";
import { PiListPlusThin, PiFileCloudLight } from "react-icons/pi";

// import { useState } from "react";

// import dayjs from "dayjs";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";


import Participant from "./participant";


function AddEvent() {
  // const [value, setValue] = useState('');
  // console.log(value);
  return (
    <div className="">
      <div className="flex">
        <div className="flex flex-col w-1/2 p-[10px] gap-[10px]">
          <input
            className="focus:outline-none placeholder:text-[20px] placeholder:text-[#202124] p-[5px] bg-transparent"
            type="text"
            placeholder="Tiêu đề"
          />
  
          <div className="flex border-[2px] rounded-[5px]">
            <IconContext.Provider
              value={{ size: "30px"}}
            >
              <PiListPlusThin />
            </IconContext.Provider>
            <textarea
              className="focus:outline-none w-[95%] p-[3px] "
              type="text"
              rows="5"
              placeholder="Chi tiết"
            />
          </div>
      {/* datepicker */}
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                className="w-[40%]"
                label=""
                // defaultValue={dayjs('today')}
                slotProps={{ textField: { size: 'small' } }}
                format="DD/MM/YYYY"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                // color={'primary'}
              />
            </DemoContainer>
          </LocalizationProvider> */}
      {/* upload file     */}
          <label
            className="w-[40%] my-[8px] flex flex-col items-center gap-[20px] cursor-pointer content-between justify-center border-2 border-dashed border-[#cacaca] bg-[rgba(255, 255, 255, 1)] p-6 rounded-[10px] shadow-[0px 48px 35px -48px rgba(0,0,0,0.1)]"
            htmlFor="file"
          >
            <IconContext.Provider
              value={{ color: "rgba(75, 85, 99, 1)", size: "80px" }}
            >
              <PiFileCloudLight />
            </IconContext.Provider>
            <div className="flex items-center justify-center">
              <span className="font-normal text-[rgba(75, 85, 99, 1)]">
                Click to upload image
              </span>
            </div>
            <input className="hidden" type="file" id="file" />
          </label>
        </div>
        <div className="w-1/2 p-[10px]">
          <Participant/>
        </div>
      </div>
      <button className="eventBtn w-[10%] mt-[20px] relative left-[50%] translate-x-[-50%]">
        <span>Lưu</span>
      </button>
    </div>
  );
}

export default AddEvent;
