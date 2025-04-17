require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')
const postRouter = require('./routers/postRouter')
const commentRouter = require('./routers/commentRouter');
const notifyRouter = require('./routers/notifyRouter');
const messageRouter = require('./routers/messageRouter');
const socketServer = require("./socketServer");
const exploreRouter = require('./routers/exploreRouter');

const app = express();

app.use(express.json()); // for body parsing..
app.use(cors());
app.use(cookieparser());

//routes
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use('/api',authRouter)
app.use('/api',userRouter)
app.use('/api',postRouter)
app.use('/api',commentRouter)
app.use('/api',notifyRouter)
app.use('/api',messageRouter)
app.use('/api',exploreRouter)


const port =  5000;
const URL = "mongodb+srv://priyanshumaheshwari704:admin%40123@cluster0.qjoqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

io.on('connection', socket=>{
  socketServer(socket)
})

mongoose.connect(
  URL,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("db is connected");
  }
);



http.listen(port, () => {
  console.log(`app is running on ${port}`);
});
