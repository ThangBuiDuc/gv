import { useEffect, useState } from "react";
// import {MdOutlineKeyboardArrowDown} from "react-icons/md"


export default function Index() {
    const [dataclass, setDataclass] = useState()
    const [batch, setBatch] = useState()
    const [khoahoc, setKhoahoc] = useState()
    // const [classlist, setClasslist]= useState()
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        console.log("gọi lại api")
        const callApi = async () => {

            await fetch(`https://renluyen.hasura.app/api/rest/batch`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-hasura-admin-secret': `WtRdFly5j5RuA149pEo8GetysucBflfen3RiQ77CmbY7tl0YVfi6J79d7MS7sFBd`,
                },
                // body:JSON.stringify({masv:'1912101003'})

            })
                .then(response => response.json())
                .then(data => {
                    setBatch(data.result[0].id)

                });
        }
        callApi();
    }, []);

    useEffect(() => {
        console.log("gọi lại api")
        const callApi = async () => {

            await fetch(`https://renluyen.hasura.app/api/rest/manager_get_class_list/2151024042/${batch}/${selectedOption}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-hasura-admin-secret': `WtRdFly5j5RuA149pEo8GetysucBflfen3RiQ77CmbY7tl0YVfi6J79d7MS7sFBd`,
                },
                // body:JSON.stringify({masv:'1912101003'})

            })
                .then(response => response.json())
                .then(data => {
                    setDataclass(data.class_managerments)

                });
        }
        callApi();
    }, [selectedOption]);

    // console.log(classlist)
    useEffect(() => {
        console.log("gọi lại api")
        const callApi = async () => {

            await fetch(`https://renluyen.hasura.app/api/rest/manager-major/2151024042/1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-hasura-admin-secret': `WtRdFly5j5RuA149pEo8GetysucBflfen3RiQ77CmbY7tl0YVfi6J79d7MS7sFBd`,
                },
                // body:JSON.stringify({masv:'1912101003'})

            })
                .then(response => response.json())
                .then(dataclass => {
                    setDataclass(dataclass.result)
                    setKhoahoc(dataclass.result.reduce((total, item) => {
                        if (total.some(el => el === item.ma_khoa_hoc)) {
                            return [...total]
                        } else {
                            return [...total, item.ma_khoa_hoc]
                        }
                    }, []))
                });
        }
        callApi();
    }, [batch]);
    // console.log(dataclass.reduce((total,item) => {
    //     if(total.some(el => el===item.ma_khoa_hoc)){
    //         return [...total]
    //     }else{
    //         return [...total,item.ma_khoa_hoc]
    //     }
    // },[]));
    console.log(dataclass);
    console.log(khoahoc);





    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);

        console.log('Selected Option:', event.target.value);
        // Xử lý logic tại đây với giá trị được chọn
    };


    return (
        <div className="wrap">
            <h3 className="text-[30px] text-center">Danh sách lớp</h3>




            <div className="relative inline-block text-left">
                <select
                    className="appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    defaultValue={selectedOption}
                    onChange={handleOptionChange}
                >
                    <option value="" disabled>--Chọn khóa học--</option>
                    {khoahoc && khoahoc.map((khoahoc) => (
                        <option key={khoahoc} value={khoahoc}>{khoahoc}
                        </option>
                    ))}
                </select>

            </div>



            <div className="container mx-auto">

                <div  >
                    <table className="min-w-full border-collapse border border-gray-300 ">
                        <thead>
                            <tr >
                                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">Lớp</th>
                                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">Tự đánh giá</th>
                                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">Lớp trưởng đánh giá</th>
                                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left">Quản lý đánh giá</th>
                                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-center">Tổng kết</th>
                                <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataclass && dataclass.map((classs, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b border-gray-300">{classs.class_code}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">ĐÃ HOÀN THÀNH</td>
                                    <td className="py-2 px-4 border-b border-gray-300">ĐÃ HOÀN THÀNH</td>
                                    <td className="py-2 px-4 border-b border-gray-300">CHƯA ĐÁNH GIÁ</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">0</td>
                                    <td className="py-2 border-b border-gray-300">
                                        <button className="border border-gray-300 px-[10px] rounded-lg bg-[#C9F7F5] text-[#1BC5BD] font-semibold"
                                                onClick={()=>{
                                                    console.log(`mã lớp ${classs.class_code} `);
                                                }}>
                                            Đánh giá
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>


        </div>
    )
}
