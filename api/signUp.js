import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id, magv , fullname} = req.body;

  const status = await fetch(`https://api.clerk.dev/v1/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VITE_APP_CLERK_SECRET_KEY}`,
    },
    body: JSON.stringify({
      public_metadata: { magv: `${magv}` , name:`${fullname}`},
    }),
  })
  .then(res => res.status)
  if(await status === 200) return res.status(200).json({ result: "successful" })
}
