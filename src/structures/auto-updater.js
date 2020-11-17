const http = require("http");
const { execSync } = require("child_process");
const server = http.createServer((req, res) => {
    console.log(req.headers);
    if(req.method === "POST") {
        if(req.headers["x-github-event"] === "push") {
            try {
                console.log(execSync("cd /home/Caffe && git pull && pm2 restart default").toString());
            } catch (e) {
                console.error(e);
            }
        }
    }
    res.statusCode = 204;
    res.end();
});

server.listen(443);