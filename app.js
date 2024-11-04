const express = require('express')
const app = express()
const userModel = require('./Models/user')
const cookieParser = require('cookie-parser')
const path = require('path');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

//var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

app.set("view engine", "ejs")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())


const port = 3000

app.get('/', (req, res) => {
    //res.cookie("name", "Prachi");
    //res.send("Done ");
    res.render('index')
})

app.post('/create', async (req, res) => {

    let { username, email, password } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password: hash
            })
            let token = jwt.sign({ email }, "shhh")
            res.cookie("token", token);
            console.log("token", token)
            res.send(createdUser)

        });
    });
})

app.post('/login', async function (req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) return res.send("Something is wrong")

    bcrypt.compare(password, user.password, function (err, result) {
        if (result)
        {
            let token = jwt.sign({ email : user.email }, "shhh")
            res.cookie("token", token);
            res.send("Login Successfully !")
        }
        else
          res.send("Something is wrong")

    });

})

app.get('/login', async function (req, res) {
  //  let data = jwt.verify(req.cookies.token, "secret")

    res.render('login')
})

app.get('/logout', function (req, res) {
    res.cookie("token", "");
    res.redirect('/')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}) 