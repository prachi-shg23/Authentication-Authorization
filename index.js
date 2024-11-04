const cookieParser = require('cookie-parser')
const express = require('express')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

const app = express()
const port = 3000

app.use(cookieParser())

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


app.get('/', (req, res) => {
    res.cookie("name", "Prachi");
    res.send("Done ");
})

app.get('/read', (req, res) => {
    let data    = jwt.verify(req.cookies.token,"secret")
    console.log(data)
    console.log(req.cookies)

    res.send("Done read");
})

bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash("World", salt, function (err, hash) {
        console.log(hash)
    });
});

// Load hash from your password DB.
bcrypt.compare("World", "$2b$10$2lsDFM0bqzfa6yISjbBn8O0quKOTjESwM4RRUzYdr6uru56i9.VhS", function (err, result) {
    console.log("Match Password !", result)
});


app.get('/token', (req, res) => {
    let token = jwt.sign({email: "prachishg88@gmail.com"}, "secret" );
    res.cookie("token", token);
    console.log("token", token)
    res.send("Done Token");

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}) 