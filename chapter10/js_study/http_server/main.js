const http = require("http");
const port = 3000;

const server = http.createServer((request, response) => {
    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    const responseMessage = "<h1>Hello World</h1>";
    response.end(responseMessage);
    console.log(`sent a response : ${responseMessage}`);
});
server.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);
