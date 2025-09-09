const http = require("http");
const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "./db/todo.json");

const server = http.createServer((req, res) => {
  // get url with path name

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathUrl = url.pathname;

  // get data
  if (pathUrl === "/todos" && req.method === "GET") {
    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    res.writeHead(201, {
      "content-type": "application/json",
      // 'email' : 'ahanaf@gmail.com'
    });

    // or we can use setHeader to set header data :

    // res.setHeader('content-type' , 'text/plain')
    // res.setHeader('email' , 'ahanaf@gmail.com')
    // to set status code :
    // res.setStatusCode = 301

    // passing json data
    res.end(data);
  }
  // post or create data
  else if (req.url === "/todos/create-todos" && req.method === "POST") {
    let userData = "";
    req.on("data", (chunk) => {
      // concat data
      userData = userData + chunk;
    });

    req.on("end", () => {
      const { title, body } = JSON.parse(userData);

      const createdAt = new Date().toLocaleString();
      const allTodo = fs.readFileSync(filePath, { encoding: "utf-8" });
      const parsedTodo = JSON.parse(allTodo);
      console.log(parsedTodo);

      parsedTodo.push({ title, body, createdAt });
      fs.writeFileSync(filePath, JSON.stringify(parsedTodo, null, 2), {
        encoding: "utf8",
      });

      res.end(JSON.stringify({ title, body, createdAt }, null, 2));
    });
  }
  // get single todo  =>
  else if (pathUrl === "/todo" && req.method === "GET") {
    const title = url.searchParams.get('title')
    console.log(title)
    const data = fs.readFileSync(filePath, { encoding: "utf-8" });
    const parsedTodo = JSON.parse(data)
    const findTodo = parsedTodo.find((todo) => todo.title === title)
    const stringifyTodo = JSON.stringify(findTodo)
    res.writeHead(201, {
      "content-type": "application/json",
    });
    res.end(stringifyTodo);

  } else {
    res.end("Route not found ");
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("✅ Server is running in port 5000");
});
