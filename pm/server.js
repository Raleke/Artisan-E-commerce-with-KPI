const express = require("express"),
mongoose = require("mongoose"),
cors = require("cors"),
helmet = require("helmet"),
session = require("express-session"),
flash = require("connect-flash"),
{authenticateUser} = require("./middleware/authenticateUser"),
app = express();

mongoose.connect("mongodb://127.0.0.1:27017/UserAPI");

app.use(session({
    secret:"mysecretkey",
    resave:true,
    saveUninitialized:true
}))

app.use(flash());
app.use((req,res,next) => {
    res.locals.message = req.flash("message");
    res.locals.error_msg = req.flash("error_msg");

    next();
})


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/", require('./route/uRoute'));
app.use("/", require('./route/InvRoute'));
app.use("/", require('./route/uRoute'));
app.use("/", require('./route/fRoute'));

app.get('/protected-route', authenticateUser, (req, res) => {
    res.status(200).json({
      message: 'This is a protected route',
      user: req.user,  
    });
  });

app.listen(5200,()=> console.log("Server Started on port 5200"));