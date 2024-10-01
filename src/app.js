const express = require('express')

let app = express()

//order matters in the route handling concept

app.get("/test" , (request , response)=>{
    response.send('Hello ma chai test ho hae.')
})


// jati sukai b bich ma vayeni kei hunna hae elley kam garxa
    app.get("/ab+c" , (request , response)=>{
        response.send("Ma chai abc tester ho hae")
    })

// easma chai hami ley optinal vayeni hunxa navaye ni hunxa kei hunna route ley work garxa
 app.get("/ab?c" , (request , response)=>{
    response.send("Hello ma cahai optional ho hae")
 })


 //easma chai bich ma j sukai hos we dont care sabai work garxa hae
  app.get("/x*z" , (request ,response)=>{
    response.send("Ma chai bich ma j sukai aawosh work garxu la.")
  })

 app.get("/" ,(request , response)=>{
     response.send("Hello i am the dashboard.")
 })

 // http methods
 //get , post , put , patch . delete



app.listen(8000 , (request , response)=>{
    console.log("server has started")   
})