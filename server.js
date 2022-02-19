const express = require("express");
const app = express();

const uuidv4 = require("uuid").v4;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 80;

const Mongoose = require("mongoose");
const dbURL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/public";
Mongoose.connect(dbURL);

const udb = Mongoose.connection;

const userSchema = new Mongoose.Schema({
    _id: String,
    firstname: String,
    lastname: String,
    email: String,
    age: { type: Number, min: 18, max: 70 },
    createdDate: { type: Date, default: Date.now }
})
const user = Mongoose.model("User", userSchema);

udb.once('open', () =>
{
    console.log('Database is connected');
});
udb.on('error', console.error.bind(console, 'connection error:'));

// PAGES |
//       V

// HOME

app.get("/", (req, res) =>
{
    res.send(`
    <a href="/newuser">New User</a>
    <a href="/userlist">User List</a>
    `);
})

//NEW USER

app.get("/newuser", (req, res) =>
{
    res.send(`
        <a href="/">Home</a>
        <a href="/userlist">User List</a>
        <form action="/newuser" method="POST">
            <input name="firstname" type="text" placeholder="First Name"/>
            <input name="lastname" type="text" placeholder="Last Name"/>
            <input name="email" type="email" placeholder="Email"/>
            <input name="age" type="number" placeholder="Age"/>
            <button type="submit">Submit</button>
        </form>
    `);
})

app.post("/newuser", (req, res) =>
{
    console.log("POST /newuser")
    const newUser = new user();
    newUser._id = uuidv4();
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.email = req.body.email;
    newUser.age = req.body.age;
    newUser.save((err, data) =>
    {
        if (err)
        {
            return console.log(error);
        }
        console.log(`Saving new user's data: ${data}`);
    })
    res.redirect("/newuser");
})

//USERLIST

app.get("/userlist", (req, res) =>
{
    user.find({}, (err, data) =>
    {
        let users = "";
        if (data)
        {
            let dbData = data;
            dbData.sort((a, b) => (a.firstname > b.firstname ? 1 : -1))
            for (let i = 0; i < dbData.length; i++)
            {
                users += `
            <li>
                ${dbData[i].firstname + " " + dbData[i].lastname}: (<a href="users/${dbData[i].firstname}">Edit</a>)
                <ul>
                    <li>Email: ${dbData[i].email}</li>
                    <li>Age: ${dbData[i].age}</li>
                </ul>
            </li>
        `
            }
        }
        res.send(`
        <a href="/">Home</a>
        <a href="/newuser">New User</a>
        <div>
            <form action="/userlist" method="POST">
                <input id="search" name="searchterm" placeholder="Search" />
            </form>
            <h2>Users: (<a href="/userlist/descending">Ascending</a>)</h2>
            <ol id="userlist">
                ${users}
            </ol>
        </div>
        `);
    })
})

app.get("/userlist/descending", (req, res) =>
{
    user.find({}, (err, data) =>
    {
        let users = "";
        if (data)
        {
            let dbData = data;
            dbData.sort((a, b) => (a.firstname < b.firstname ? 1 : -1))
            for (let i = 0; i < dbData.length; i++)
            {
                users += `
            <li>
                ${dbData[i].firstname + " " + dbData[i].lastname}: (<a href="users/${dbData[i].firstname}">Edit</a>)
                <ul>
                    <li>Email: ${dbData[i].email}</li>
                    <li>Age: ${dbData[i].age}</li>
                </ul>
            </li>
        `
            }
        }
        res.send(`
        <a href="/">Home</a>
        <a href="/newuser">New User</a>
        <div>
            <form action="/userlist" method="POST">
                <input id="search" name="searchterm" placeholder="Search" />
            </form>
            <h2>Users: (<a href="/userlist">Descending</a>)</h2>
            <ol id="userlist">
                ${users}
            </ol>
        </div>
        `);
    }
    );
})

app.post("/userlist", (req, res) =>
{
    if (req.body.searchterm)
    {
        app.post("POST /userlist (search)")
        let users = "";
        user.find({}, (err, data) =>
        {
            if (data)
            {
                let dbData = data;
                dbData.sort((a, b) => (a.firstname > b.firstname ? 1 : -1))
                for (let i = 0; i < dbData.length; i++)
                {
                    const search = dbData[i].firstname + " " + dbData[i].lastname;
                    const searchTerm = req.body.searchterm;
                    if (search.toLowerCase().includes(searchTerm.toLowerCase()))
                    {
                        users += `
                            <li>
                                ${dbData[i].firstname + " " + dbData[i].lastname}: (<a href="users/${dbData[i].firstname}">Edit</a>)
                                <ul>
                                    <li>Email: ${dbData[i].email}</li>
                                    <li>Age: ${dbData[i].age}</li>
                                </ul>
                            </li>
                        `
                    }
                }
                res.send(`
                    <a href="/">Home</a>
                    <a href="/newuser">New User</a>
                    <div>
                        <form action="/userlist" method="POST">
                            <input id="search" name="searchterm" placeholder="Search" value="${req.body.searchterm}" />
                        </form>
                        <h2>Users:</h2>
                        <ol id="userlist">
                            ${users}
                        </ol>
                    </div>
                    `);
            }
        })
    }
    else
    {
        //TODO: DELETE USER
        console.log(`POST /userlist (delete ${req.body.user})`)
        user.findOneAndDelete({ firstname: req.body.user }, (err, data) => { if (err) (console.log(err)) });

        user.find({}, (err, data) =>
        {
            if (data)
            {
                let users = "";
                let dbData = data;
                dbData.sort((a, b) => (a.firstname > b.firstname ? 1 : -1))
                for (let i = 0; i < dbData.length; i++)
                {
                    users += `
                <li>
                    ${dbData[i].firstname + " " + dbData[i].lastname}: (<a href="users/${dbData[i].firstname}">Edit</a>)
                    <ul>
                        <li>Email: ${dbData[i].email}</li>
                        <li>Age: ${dbData[i].age}</li>
                    </ul>
                </li>
            `

                }
                res.send(`
        <a href="/">Home</a>
        <a href="/newuser">New User</a>
        <div>
            <form action="/userlist" method="POST">
                <input id="search" name="searchterm" placeholder="Search" />
            </form>
            <h2>Users:</h2>
            <ol id="userlist">
                ${users}
            </ol>
        </div>
        `);
            }
        }
        )
    }
})

//EDIT USER

app.get("/users/:user", (req, res) =>
{
    user.find({ firstname: req.params.user }, (err, data) =>
    {
        if (data)
        {
            let dbData = data;
            if (dbData.length == 0)
            {
                res.send("404 Not Found")
            }
            else
            {
                res.send(`
                        <a href="/">Home</a>
                        <a href="/userlist">User List</a>
                        <form action="/users/${dbData[0].firstname}" method="POST">
                            <input name="firstname" type="text" placeholder="First Name" value="${dbData[0].firstname}"/>
                            <input name="lastname" type="text" placeholder="Last Name" value="${dbData[0].lastname}"/>
                            <input name="email" type="email" placeholder="Email" value="${dbData[0].email}"/>
                            <input name="age" type="number" placeholder="Age" value="${dbData[0].age}"/>
                            <button type="submit">Submit</button>
                        </form>
                        <form action="/userlist" method="POST">
                            <input type="hidden" name="user" value="${dbData[0].firstname}" />
                            <button type="delete">Delete User</button>
                        </form>
                    `);
            }
        }
    }
    )
})

app.post("/users/:user", (req, res) =>
{
    console.log(`POST /user/${req.params.user}`);
    user.findOneAndUpdate({ firstname: req.params.user }, { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, age: req.body.age }, () => { });
    user.find({}, (err, data) =>
    {
        if (data)
        {
            let users = "";
            let dbData = data;
            for (let i = 0; i < dbData.length; i++)
            {
                users += `
                        <li>
                            ${dbData[i].firstname + " " + dbData[i].lastname}: (<a href="../users/${dbData[i].firstname}">Edit</a>)
                            <ul>
                                <li>Email: ${dbData[i].email}</li>
                                <li>Age: ${dbData[i].age}</li>
                            </ul>
                        </li>
                    `
            }
            res.send(`
                    <a href="/">Home</a>
                    <a href="/newuser">New User</a>
                    <div>
                        <h2>Users:</h2>
                        <ol>
                            ${users}
                        </ol>
                    </div>
                `);

        }
    }

    )
})

app.listen(port, () =>
{
    console.log("Server listening on port 80")
})
