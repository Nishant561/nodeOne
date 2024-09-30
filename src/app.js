const express = require('express')

let app = express()

 app.get("/" ,(request , response)=>{
     response.send("Hello i am the dashboard.")
 })

app.get("/test" , (request , response)=>{
    response.send('Hello ma chai test ho hae.')
})



app.listen(8000 , (request , response)=>{
    console.log("server has started")   
})