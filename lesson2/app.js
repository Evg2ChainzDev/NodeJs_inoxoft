const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');

const {PORT} = require('./configs/config')
const users = require('./dataBase/users')

const app = express();
const staticPath = path.join(__dirname, 'static' )

app.use(express.json()) // teach our express to read json files
app.use(express.urlencoded({extended: true})) // teach our express to read json files
app.use(express.static(staticPath)) // unlock folder for node

app.set('view engine', '.hbs'); 
app.engine('.hbs', expressHbs.engine({ defaultLayout: false })); // .engine upd 2022
app.set('views', staticPath)  

app.post('/auth', function(req, res) {
    let {name, password} = req.body;

    const user = users.find(user=>user.name===name)

    if (!user) {
        res.status(404).end('User not found');
        // respons didn't finish function so we need to write return
        return;
    }
    // console.log(body);
    res.json(user)
})
app.get('/ping', (req, res) => { res.status(200).json({name: 'Dima1'})})
app.get('/users', (req, res) => { 
     res.render('users', {userName: "Evgeniy", users, isMale: true})})  // two parametrs. 1 what render 2 options
app.get('/users/:user_id', (req, res) => { 

    const {user_id} = req.params;
    const query =req.query;
    console.log(query)


    res.status(200).json(users[user_id])
})

// Render endpoints
app.get('/login', (req, res) => {
    res.render('login') // node try to find views in default folder (static) login.hbs .
})

app.listen (PORT, () => {
    console.log('app listen ', PORT)
})  