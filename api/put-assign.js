export default async function handler(req, res) {
    // try {
    //   // const a = new Date().toISOString()
    //   const data = await fetch(
    //     `https://apis.haravan.com/web/blogs/1000296265/articles.json`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization:
    //           "Bearer 73FFE2D4D085F825F817BDB9CDE300191828ADC476E9F5B9140ED57FB023506D",
    //         "Access-Control-Allow-Origin": "*",
    //       },
    //     }
    //   );
  
    //   const data1 = await data.json();
    //   return res.status(200).json({ data1 });
    // } catch {
    //   return res.status(400).json({ result: "Bad request" });
    // }
  
    return res.send(`Hello!`);
  }