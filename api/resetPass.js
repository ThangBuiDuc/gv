import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id, pass } = req.body;

  const status = await fetch(`https://api.clerk.dev/v1/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
    body: JSON.stringify({
      password: pass,
    }),
  }).then((res) => res.json());
  //   .catch(err => err.errors[0].message)

  //   console.log(status)

  if (await status.errors)
    return res.status(400).json({ result: status.errors[0].message });
  else return res.status(200).json({ result: "successful" });
}
