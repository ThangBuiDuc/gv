import fetch from "node-fetch";



export default async function article(req, res) {
  try {
    // const a = new Date().toISOString()
    const data = await fetch(
      `https://apis.haravan.com/web/blogs/1000732692/articles.json?limit=9&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 73FFE2D4D085F825F817BDB9CDE300191828ADC476E9F5B9140ED57FB023506D",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    const data1 = await data.json();
    return res.status(200).json({ data1 });
  } catch {
    return res.status(400).json({ result: "Bad request" });
  }
}
