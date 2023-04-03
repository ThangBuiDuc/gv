import fetch from "node-fetch";
import os from 'os';


export default async function Handler(req, res) {
    
    const result = await fetch(`https://sv.hpu.edu.vn/api/article`,{
        method:'GET',
        
    }).then(res => res)
    // console.log(result)
    console.log(req.headers)

   res.status(200).json(req.headers)
    
  }