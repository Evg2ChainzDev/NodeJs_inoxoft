const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFilePromise = util.promisify(fs.readFile)
const writeFilePromise = util.promisify(fs.writeFile)
const appendFilePromise = util.promisify(fs.appendFile)

const dbPath = path.join(__dirname, 'dataBase', 'users.json')

const {PORT} = require('./configs/config')
const users = require('./dataBase/users');
const { slice } = require('./dataBase/users');
let usersFFile = 'default meaning';

readFilePromise( dbPath, (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    return data.toString()
}).then(data => {usersFFile = JSON.parse(data); console.log(typeof(usersFFile)) })

// console.log(1 + usersFFile);
const app = express();
const staticPath = path.join(__dirname, 'static' )

app.use(express.json()) // teach our express to read json files
app.use(express.urlencoded({extended: true})) // teach our express to read json files
app.use(express.static(staticPath)) // unlock folder for node

app.set('view engine', '.hbs'); 
app.engine('.hbs', expressHbs.engine({ defaultLayout: false })); // .engine upd 2022
app.set('views', staticPath)  


app.get('/ping', (req, res) => { res.status(200).json({name: 'Dima1'})})


    // Render endpoints
app.get('/login', (req, res) => {
    res.render('login') // node try to find views in default folder (static) login.hbs .
    })
app.get('/register', (req, res) => {
    res.render('register') // node try to find views in default folder (static) login.hbs .
    })
app.get('/allusers', (req, res) => { 
    res.render('allUsers', {usersFFile})
    console.log(usersFFile)
    })  
    // two parametrs. 1 what render 2 options
    // console.log(usersFFile)    
app.get('/users/:user_id', (req, res) => { 
    const {user_id} = req.params;
    const query =req.query;
    // console.log(query)
    res.status(200).json(users[user_id])
    })

    // Render auths
app.post('/auth', function(req, res) {
    let {email, password} = req.body;
    console.log(email, password);
    const user = usersFFile.find(user=>user.email===email)
    let ifLoginSuccessful = false;
    let ifLoginWrong = true;
    if (!user) {
        // res.status(404).end('User not found');
        // respons didn't finish function so we need to write return;
        res.render('register', {ifLoginWrong});
        return;
    }
    // console.log(body);
    ifLoginSuccessful = true;
    res.render('allUsers', {usersFFile,ifLoginSuccessful});
    })

app.post('/auth2', function(req, res) {
    let { email, password} = req.body;
    // console.log(   `this is what we get in body ${email}  ${password}`, )
    const user = users.find(user=>user.email===email)

    if (user) {
        // res.status(404).end('User not found');
        // respons didn't finish function so we need to write return;
        res.render('error');
        return;
    }

    readFilePromise( dbPath, (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            return data;
        }).then(data => {
            console.log(data);
            usersFFile = JSON.parse(data);

            console.log(usersFFile);
            const newUser = { email, password }

            usersFFile.push(newUser);
            console.log(usersFFile);

            writeFilePromise(dbPath, JSON.stringify(usersFFile) ,(err) => {
                // console.log(1);
                if (err) {
                    console.log(err)
                    return
                }
            }).then(() => {
                readFilePromise(dbPath, (err, data) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                    }).then((data) => {
                        console.log(33);    
                        usersFFile = JSON.parse(data);

                        res.render('allUsers', { usersFFile });
                    })
            })
    })

    })


app.listen (PORT, () => {
    console.log('app listen ', PORT)
    })  