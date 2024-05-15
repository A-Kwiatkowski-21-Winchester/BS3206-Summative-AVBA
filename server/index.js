require('dotenv').config();
const cors = require('cors');
const dbUtil = require('./libs/dbUserUtils')
const express = require('express');

PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())


let env;
try {
    env = require('./env/environment');
} catch {
    console.error("Unable to load './env/environment.js'. Have you filled out the template and renamed it?");
}


let dbExample = require('./examples/dbconnect-exampleuse');
dbExample.exampleRun();


app.get('/', async (req, res) => {
    // res.send('Hello universe!');
    console.log("Running code within GET")
    data = await dbUtil.getUserData("John@Smith.com","title","email")
    .then((data) => console.log(data))
    data = await dbUtil.getUserWhole("John@Smith.com","email")
    .then((data) => console.log(data))
});

app.post('/login', async (req,res) => {
    data = await dbUtil.getUserData(req.email,"_id","email")
    console.log(data)
    
});

app.post('/signup', (req,res) => {
    res.send('Signup Recieved');
    
    console.log(req.body)
    data = req.body;
    if (data.sex == 0){data.sex = dbUtil.sex.MALE}
    if (data.sex == 1){data.sex = dbUtil.sex.FEMALE}
    if (data.sex == 2){data.sex = dbUtil.sex.OTHER}
    dbUtil.createUser({
    title: data.title,
    firstName:data.firstname,
    lastName: data.surname,
    dob: new Date("2024-05-06"),
    sex: data.sex,
    email: data.emailaddress,
    phone: "07000000000",
    password: data.password,
    isAdmin:false,});
    
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});