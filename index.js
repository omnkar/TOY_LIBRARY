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

app.get("/",(req,res)=>
{
    res.render("toies/home.ejs");
})
app.get("/toys/:id",(req,res)=>
{   
    let {id}=req.params;
    let q=`select * from toy where toyid='${id}'`;
    try
    {
        connection.query(q,(err,result)=>
        {
            if(err)
            {
                throw err;
            }
            let toy=result[0];
            res.render("toies/showToys.ejs",{toy});
        });
    }
    catch(err)
    {
        console.log(err);
    }
   
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
//index route
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
            res.render("toies/index.ejs",{toys});
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