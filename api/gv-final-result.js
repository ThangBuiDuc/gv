import fetch from "node-fetch";

export default async function Handler(req, res) {
  const { subject_code, class_code, present, token } = JSON.parse(req.body);
  // console.log(req.body)
  // console.log(req.body.subject_code)
  const point = await fetch(
    `https://edu-survey.hasura.app/api/rest/final-teacher`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        args: {
          sbj_code: subject_code,
          clss_code: class_code,
          hk: present.hocky,
          nam: present.manamhoc,
        },
      }),
    }
  )
    .then((res) => res.json())
    .then((res) => res.result.total);
  // .then(res => res.total)

  if (point) {
    let result = await fetch(
      `https://edu-survey.hasura.app/api/rest/update-course`,
      {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _set: {
            teacher_result: point,
            updated_at: new Date(),
          },
          where: {
            subject_code: {
              _eq: subject_code,
            },
            class_code: {
              _eq: class_code,
            },
            hocky: {
              _eq: present.hocky,
            },
            namhoc: { _eq: present.manamhoc },
          },
        }),
      }
    ).then(res=>res.status);

    if(result === 200) res.status(200).json({ result: "success" });
  } else {
    res.status(400).json({ result: "failed" });
  }

  // console.log(point)
}
