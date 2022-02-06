const express = require("express");
const { render } = require("express/lib/response");
const app = express();

app.use(express.json)
app.use(express.urlencoded({ extended: true }))

const port = 80;

// const Mongoose = require("mongoose");
// const dbURL = "mongodb://localhost:27017/public"
// Mongoose.connect(dbURL)

// const udb = Mongoose.connection;

// const userSchema = new Mongoose.Schema({
//     name: String,
//     role: String,
//     age: { type: Number, min: 18, max: 70 },
//     createdDate: { type: Date, default: Date.now }
// })
//const user = Mongoose.model("User", userSchema);

// udb.once('open', function ()
// {
//     console.log('Database is connected');
// });
// udb.on('error', console.error.bind(console, 'connection error:'));

app.get("/", (req, res) =>
{
    console.log("GET");
    res.send("Hi");
    res.end();
})

app.post("/newUser", (req, res) =>
{
    console.log("POST /newUser")
    // const newUser = new user();
    // newUser.name = req.body.name;
    // newUser.role = req.body.role;
    // newUser.save((err, data) =>
    // {
    //     if (err)
    //     {
    //         return console.log(error);
    //     }
    //     console.log(`Saving new user's data: ${data}`);
    //     res.send(`done ${data}`)
    // })
    res.end();
})

app.listen(port, () =>
{
    console.log("Server listening")
})