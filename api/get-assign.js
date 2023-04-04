import fetch from "node-fetch";

export default async function Handler(req, res) {
    
    const {present,khoa_gv,code} = JSON.parse(req.body)
    const is_truong_khoa = await fetch(`${process.env.VITE_BACK_END_IS_TRUONG_KHOA}${code}`,{
        method:'GET',
        headers : {
            "x-hasura-admin-secret" : `${process.env.VITE_BACK_END_HASURA_KEY}`
        }
    }).then(res => res.json())
    .then(res => res.result[0].is_truong_khoa)

    if(is_truong_khoa){
        const result = await fetch(`${process.env.VITE_GET_ASSIGN_OBJECT_API}${khoa_gv}/${
            present.hocky
          }/${present.manamhoc}`,{
            method:'GET',
            headers : {
                "x-hasura-admin-secret" : `${process.env.VITE_BACK_END_HASURA_KEY}`
            }
        }).then(res => res.json())
        .then(res => res.result)
        return res.status(200).json({result})
    }else return res.status(400).json({result: 'Failed!'});
    
  }