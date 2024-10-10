const express=require("express");
const app=express();
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const path=require("path");
const mysql=require('mysql2');
const { render } = require("ejs");
const session=require("express-session");
const flash=require("connect-flash");
const ExpressError=require("./utils/ExpressError.js");

const port=8000;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }   
}
const connection=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        database:"toylibrary",
        password:"sa123"
    }
);
app.use(session(sessionOption));
app.use(flash());
app.use((req,res,next)=>
    {
        res.locals.success=req.flash("success");
        res.locals.failure=req.flash("error");
        next();
    
    })
app.get("/",(req,res)=>
{
    res.render("toies/home.ejs");
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
//create route
app.get("/addtoy",(req,res)=>
{
    res.render("toies/new.ejs");
})
//issued toy
app.get("/toys/issuetoy",(req,res)=>
{
    //console.log("in issused toy");
    res.render("toies/issuedToy.ejs");
})
//return toy
app.get("/toys/returntoy",(req,res)=>
{
    res.render("toies/returnToy.ejs");
})
//tracktoy
app.get("/toys/tracktoy",(req,res)=>
{
    let q=`SELECT 
    t.toyid as Id,
    t.toyname AS ToyName, 
    m.membername AS MemberName, 
    m.memcontact AS MemberContact, 
    ts.status AS ToyStatus, 
    f.fine AS FineAmount
    FROM 
        transaction tr
    JOIN 
        toy t ON tr.toyid = t.toyid
    JOIN 
        member m ON tr.memid = m.memberid
    JOIN 
        toystatus ts ON tr.toyid = ts.ts_toyid AND tr.memid = ts.ts_memid
    LEFT JOIN 
        fine f ON t.toyid = f.fk_toyid AND m.memberid = f.fk_memid
    WHERE 
        ts.status = 'issued' or ts.status='return'; `
    try
    {
        connection.query(q,(err,toys)=>
        {
            if(err)
            {
                throw err;
            }
            if(!toys)
            {
                req.flash("error","result set is empty");
                res.redirect("/alltoys");
            }
            // console.log(toys.length);
            res.render("toies/track.ejs",{toys});
        })
    }
    catch(err)
    {
        res.send("error",err);
    }
    
})
//show route

app.get("/toys/:id",(req,res)=>
{   
    // console.log("in show route");
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
//edit route
app.get("/toy/:id/edit",(req,res)=>
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
            if(!result)
            {
                req.flash("error","listing you requested does not exist!");
                res.redirect("/alltoys");
            }
            //console.log(result[0]);
            res.render("toies/edit.ejs",{result});
        })
    }
    catch(err)
    {
        res.send("error",err);
    }
   
})
//new route
app.post("/toys/new",(req,res)=>
{
    const { toyname, toycategory, toyimage, toyprice, toyquantity } =req.body;
   let q=`insert into toy(toyname,toyprice,toycategory,toyquantity,toyimage) values('${toyname}', '${toyprice}', '${toycategory}', '${toyquantity}', '${toyimage}')`;
   try{
    connection.query(q,(err,toy)=>
    {
        if(err)
        {
            throw err;
        }
        req.flash("success","New Toy is Added");
        res.redirect("/alltoys");
    })
   }
   catch(err)
   {
        res.send("Error",err);
   }

})
//update route
app.put("/toys/:id",(req,res)=>
{
    let{id}=req.params;
    let {toyname,toycategory,toyimage,toyprice,toyquantity}=req.body;
    let q=`UPDATE toy
    SET 
        toyname = '${toyname}',
        toyprice = '${toyprice}',
        toycategory = '${toycategory}',
        toyquantity = ${toyquantity},
        toyimage = '${toyimage}'
    WHERE toyid = ${id};`
    try
    {
        connection.query(q,(err,result)=>
        {
            if(err)
            {
                throw err;
            }
            req.flash("success","edited successfully");
            res.redirect("/alltoys");
        })
    }
    catch(err)
    {
        res.send("err",err);
    }
})
// issued toy post
app.post("/toys/issue",(req,res)=>
    {
        let { toyname, toycategory, membername, issueddate, returndate, memaddress, memcontact } = req.body;
    
        // Query to find toy details
        let q = `SELECT toyid, toyquantity FROM toy WHERE toyname = ?`;
        connection.query(q, [toyname], (err, result) => 
        {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }
    
            if (result.length === 0) {
                req.flash("error","toy not found");
                res.redirect("/alltoys");
                return;
            }
    
            const toyid = result[0].toyid;
            const toyQuantity = result[0].toyquantity;
    
            // Check if the toy is out of stock
            if (toyQuantity <= 0) {
               req.flash("error","Out of stock");
               res.redirect("/alltoys");
               return;
            }
    
            // Proceed to insert member details
            let q1 = `INSERT INTO member (membername, memaddress, memcontact) VALUES (?, ?, ?)`;
            connection.query(q1, [membername, memaddress, memcontact], (err, result) =>
            {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error inserting member.");
                }
    
                let str=`select memberid from member where memcontact='${memcontact}'`;
                connection.query(str,(err,result)=>
                {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error selecting member.");
                    }
                    let memid=result[0].memberid;
                    let q2 = `INSERT INTO transaction (toyid, memid, issueddate, returndate) VALUES (?, ?, ?, ?)`;
                    connection.query(q2, [toyid, memid, issueddate, returndate], (err, result) =>
                    {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Error inserting transaction.");
                        }
        
                        // Update the toy quantity (reduce by 1)
                        let q3 = `UPDATE toy SET toyquantity = toyquantity - 1 WHERE toyid = ?`;
                        connection.query(q3, [toyid], (err, result) => 
                        {
                            if (err) {
                                console.error(err);
                                return res.status(500).send("Error updating toy quantity.");
                            }
                            let q4=`insert into toystatus(ts_toyid,ts_memid,status)values('${toyid}','${memid}','issued')`;
                            connection.query(q4,(err,result)=>
                            {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).send("Error in toy status.");
                                }
                            })
                            // Finally, send a success response
                             //res.status(200).send("Toy issued successfully.");
                             req.flash("success","Toy Is Issued");
                             res.redirect("/alltoys");
                        });
                    });
                }) // Get the newly inserted member ID
                
                // Proceed to insert transaction details
                
            });
        });
        
    
    })
//return toy post 
app.post("/toys/return",(req,res)=>
{
    let { toyname, returndate, memcontact } = req.body;
    let q1=`select toyid,toyprice from toy where toyname='${toyname}'`;
   
        connection.query(q1,(err,result)=>
        {
            if (err) {
                console.error(err);
                return res.status(500).send("Error in toy toyname.");
            }
            let toyid=result[0].toyid;
            let rent=result[0].toyprice;
            let q2=`SELECT memid FROM transaction WHERE toyid='${toyid}' AND memid=(SELECT memberid FROM member WHERE memcontact='${memcontact}')`;
            console.log('Running Query:', q2); 
            connection.query(q2,(err,result)=>
            {
                if(err)
                {
                    console.error(err);
                    return res.status(500).send("Error in member.");
                }
                console.log('Query Result:', result);
                let memId=result[0].memid;
                let q3=`select returndate from transaction where toyid='${toyid}' and memid='${memId}'`;
                connection.query(q3,(err,result)=>
                {
                    if(err)
                    {
                        console.error(err);
                        return res.status(500).send("Error in toy transaction.");
                    }
                    let rtdate= new Date(result[0].returndate);
                    let issuedReturndate = new Date(returndate);
                    console.log(rtdate);
                    console.log(issuedReturndate);
                    const diffInMs = Math.abs(issuedReturndate - rtdate);
                    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                    console.log(diffInDays);
                    var fine;
                    if(diffInDays==0)
                    {
                        fine=0;
                    }
                    else{
                        fine=rent*diffInDays;
                    }
                    console.log(fine);
                    let q5=`insert into fine(fk_toyid,fk_memid,fine)values('${toyid}','${memId}','${fine}')`;
                    
                    connection.query(q5,(err,result)=>
                    {
                        if(err)
                        {
                            console.error(err);
                            return res.status(500).send("Error in toy fine.");
                        }
                        let q4=`update toystatus set status='return' where ts_toyid='${toyid}' and ts_memid='${memId}'`;
                        connection.query(q4,(err,result)=>
                        {
                            if(err)
                            {
                                console.error(err);
                                return res.status(500).send("Error in toy status.");
                            }
                        })
                    })

                })
            })
        })
        req.flash("success","toy return successfully");
        res.redirect("/alltoys");

})
//delete route
app.delete("/toy/:id",(req,res)=>
{
    let{id}=req.params;
    let q=`delete from toy where toyid='${id}'`;
    try
    {
        connection.query(q,(err,result)=>
        {
            if(err)
            {
                throw err;
            }
            req.flash("success","toy is removed");
            res.redirect("/alltoys");
        })
    }
    catch(err)
    {
        res.send("err",err);
    }
})
//handling wrong route error
app.all("*",(req,res,next)=>
    {
        next(new ExpressError(404,"Page Not Found!"));
    })
    app.use((err,req,res,next)=>
    {
        let{status=500,message="somthing went wrong"}=err;
        res.status(status).render("error.ejs",{err});
    })
app.listen(port,()=>
{
    console.log("listening");
})