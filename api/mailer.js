import { createTransport } from "nodemailer";
import jwt from "jsonwebtoken";

export default async function Mailer(req, res) {
  const { token, title, content } = JSON.parse(req.body);

  try {
    var decoded = jwt.verify(token, import.meta.env.VITE_SURVEY_SECRET_KEY);
    var role = decoded["https://hasura.io/jwt/claims"]["x-hasura-default-role"];
    if (role.toString() === "creator") {
      var transporter = createTransport({
        service: "Gmail",
        auth: {
          user: "thangbd@hpu.edu.vn",
          pass: "enctqzwngnkqpiea",
        },
      });
      var mainOptions = {
        from: "HPU",
        to: ["buithang770@gmail.com"],
        subject: title,
        html: content,
      };
      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          res.status(400).json({ error: err });
        } else {
          res.status(200).json({ res: "Message sent: " + info.response });
        }
      });
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).json({ result: "Unauthorized" });
  }
}
