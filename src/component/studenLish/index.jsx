import { useState } from "react";
import { useEffect } from "react"



export default function index() {

  const [data, setData] = useState([])

  useEffect(() => {
    const getStudentLish = () => {
      fetch("https://renluyen.hasura.app/api/rest/get-studen-lish/1/CT2301M", {
        headers: {
          'Content-type': 'application/json',
          'x-hasura-admin-secret': 'WtRdFly5j5RuA149pEo8GetysucBflfen3RiQ77CmbY7tl0YVfi6J79d7MS7sFBd'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setData(data.result[0].detail
            // .map((item) => {
            //   return {
            //     monitorCode: item.monitor_code,
            //     classCode: item.class_code,
            //     studentCode: item.detail.student_code,
            //     studentTotalPoint: item.detail.student_total_point,
            //     monitorTotalPoint: item.detail.monitor_total_point,
            //     managerTotalPoint: item.detail.manager_total_point,
            //     finalTotalPoint: item.detail.final_total_point,
            //     firstName: item.detail.user.first_name,
            //     lastName: item.detail.user.last_name
            //   }
            // })
          )
        })
        .catch((err) => console.log(err));
    }
    getStudentLish();
  }, [])
  console.log(data);

  return (
    <div className="wrap">
      <h3 className="text-[30px] text-center">Danh sách lớp</h3>
      <div className="container mx-auto">
        <div  >
          <table className="min-w-full border-collapse border border-gray-300 ">
            <thead>
              <tr >
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">Sinh viên</th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">Tự đánh giá</th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">Lớp trưởng đánh giá</th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">Quản lý đánh giá</th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-center">Tổng kết</th>
                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {data && data.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-300">{item.user.first_name} {item.user.last_name}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">{item.student_total_point === null ? <>Chưa đánh giá</> : item.student_total_point}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">{item.monitor_total_point === null ? "Chưa đánh giá" : item.monitor_total_point}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">{item.manager_total_point === null ? "Chưa đánh giá" : item.manager_total_point}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">0</td>
                  <td className="py-2 border-b border-gray-300"><button className="border border-gray-300 px-[10px] rounded-lg bg-[#C9F7F5] text-[#1BC5BD] font-semibold">Đánh giá</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
