import fetch from "node-fetch";
import os from 'os';


export default async function Handler(req, res) {
    
    // const result = await fetch(`https://api.fastwork.vn:6010/v1/timesheets?tokenkey=e88652cb44dc424d2eedee30b151c075`,{
    //     method:'POST',
    //     body:{
    //         "code":"Cb21@hpu",//mã đăng nhập trên FW
    //         "from":"2023-11-08",//Thời gian bắt đầu
    //         "to":"2023-11-08"//Thời gian kết thúc
    //     }
        
    // }).then(res => res)

    console.log(os.networkInterfaces())
    console.log(os.hostname())

   res.status(200).json({result: os.networkInterfaces(),result1:os.hostname()})
    
  }