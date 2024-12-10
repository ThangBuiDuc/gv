import "../../../App.css";
import { useState } from "react";
import Select from "react-select";
import PdfViewer from "./pdfViewer";

const options = [
  {
    value: 1,
    label: "Mẫu 1",
  },
  {
    value: 2,
    label: "Mẫu 2",
  },
  {
    value: 3,
    label: "Mẫu 3",
  },
];

// const Context = createContext(null);

// function CustomHits() {
//   const { hits } = useHits();
//   const setDataPass = useContext(Context);
//   return hits.map((item) => (
//     <div
//       key={item.masinhvien}
//       className="flex flex-col p-[10px] shadow-[0_2px_5px_0_#e3e5ec] rounded-[3px] border-bordercl gap-[10px]"
//     >
//       <div className="flex">
//         <div className="flex flex-col w-[50%]">
//           <h3>
//             <Highlight attribute={"masinhvien"} hit={item} />
//           </h3>
//           <h3>
//             <Highlight attribute={"hoten"} hit={item} />
//           </h3>
//           <h3>
//             <Highlight attribute={"tennganh"} hit={item} />
//           </h3>
//         </div>
//         <div className="flex flex-col w-[50%]">
//           <h3>
//             <Highlight attribute={"tenkhoahoc"} hit={item} />
//           </h3>
//           <h3>
//             <Highlight attribute={"tenhedaotao"} hit={item} />
//           </h3>
//           <h3>
//             <Highlight attribute={"tinhtrang"} hit={item} />
//           </h3>
//         </div>
//       </div>
//       <div className="flex justify-evenly items-center">
//         <button
//           className="selfBtn self-center w-fit"
//           onClick={() =>
//             setDataPass((pre) => ({
//               masv: item.masinhvien,
//               toggle: !pre.toggle,
//               type: 1,
//             }))
//           }
//         >
//           Xem Mẫu 1
//         </button>
//         <button
//           className="selfBtn self-center w-fit"
//           onClick={() =>
//             setDataPass((pre) => ({
//               masv: item.masinhvien,
//               toggle: !pre.toggle,
//               type: 2,
//             }))
//           }
//         >
//           Xem Mẫu 2
//         </button>
//         <button
//           className="selfBtn self-center w-fit"
//           onClick={() =>
//             setDataPass((pre) => ({
//               masv: item.masinhvien,
//               toggle: !pre.toggle,
//               type: 3,
//             }))
//           }
//         >
//           Xem Mẫu 3
//         </button>
//       </div>
//     </div>
//   ));
// }

export default function Index() {
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState({
    value: 1,
    label: "Mẫu 1",
  });
  const [studentCode, setStudentCode] = useState(null);
  // const [dataPass, setDataPass] = useState({
  //   masv: null,
  //   toggle: false,
  //   type: null,
  // });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Mã sinh viên</span>
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value.trim())}
            type="text"
            placeholder="Nhập mã sinh viên"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <Select
          options={options}
          //   defaultInputValue="Giảng viên"
          value={selectedOption}
          onChange={setSelectedOption}
          className="min-w-[200px] self-end z-10"
          placeholder="Lựa chọn quyền"
        />
        <button
          disabled={!query || !selectedOption}
          className="btn btn-primary self-end"
          onClick={() => setStudentCode(query)}
        >
          Tìm kiếm
        </button>
      </div>
      {studentCode && selectedOption && (
        <PdfViewer studentCode={studentCode} type={selectedOption} />
      )}
    </div>
  );
  // return (
  //   <Context.Provider value={setDataPass}>
  //     {dataPass.toggle ? (
  //       <PdfViewer dataPass={dataPass} setDataPass={setDataPass} />
  //     ) : (
  //       <div className="flex flex-col gap-[15px] ">
  //         <CustomSearchBox />
  //         <CustomHits />
  //         <Pagination
  //           classNames={{
  //             list: "flex gap-[20px] justify-center items-center",
  //             item: "p-[5px] border-bordercl border-[1px] min-w-[30px] rounded-[5px] flex justify-center items-center",
  //             selectedItem: "bg-primary [&>a]:text-white",
  //             disabledItem: "bg-bordercl cursor-not-allowed",
  //           }}
  //         />
  //       </div>
  //     )}
  //   </Context.Provider>
  // );
}
