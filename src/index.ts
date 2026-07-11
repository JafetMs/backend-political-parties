import { createServer } from "./server";



const server = createServer();

console.log(`Server running on  localhost:${server.port}`)