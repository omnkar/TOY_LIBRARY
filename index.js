const express=require("express");
const app=express();
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const path=require("path");
const mysql=require('mysql2');
const { render } = require("ejs");
const port=8000;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const connection=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        database:"toylibrary",
        password:"sa123"
    }
);

app.get("/toys",(req,res)=>
{
   res.render("toies/index.ejs");
})
//create route
app.get("/addtoy",(req,res)=>
{
    res.render("toies/new.ejs");
})
//new route
app.post("/toys/new",(req,res)=>
{

})
//issued toy
app.get("/toys/issuetoy",(req,res)=>
{
    res.render("toies/issuedToy.ejs");
})
//show route
app.get("/alltoys",(req,res)=>
{
    let q="select * from toy";
    try
    {
        connection.query(q,(err,toys)=>
        {
            if(err)
            {
                throw err;
            }
            res.render("toies/showToys.ejs",{toys});
        })
    }
    catch(err)
    {
        console.log(err);
    }

})
app.listen(port,()=>
{
    console.log("listening");
})