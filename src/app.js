const express = require('express')
const {databaseConnection} = require("./config/database")
let app = express()

//order matters in the route handling concept

// app.get("/test" , (request , response)=>{
//     response.send('Hello ma chai test ho hae.')
// })


// // jati sukai b bich ma vayeni kei hunna hae elley kam garxa
//     app.get("/ab+c" , (request , response)=>{
//         response.send("Ma chai abc tester ho hae")
//     })

// // easma chai hami ley optinal vayeni hunxa navaye ni hunxa kei hunna route ley work garxa
//  app.get("/ab?c" , (request , response)=>{
//     response.send("Hello ma cahai optional ho hae")
//  })


//  //easma chai bich ma j sukai hos we dont care sabai work garxa hae
//   app.get("/x*z" , (request ,response)=>{
//     response.send("Ma chai bich ma j sukai aawosh work garxu la.")
//   })

//  app.get("/" ,(request , response)=>{
//      response.send("Hello i am the dashboard.")
//  })

//  // http methods
//  //get , post , put , patch . delete



// Note : here the app.use("/") is always used if only the / is matched.
//      : Order is main important while handling the routes.
//      : the difference between the app.use and app.all is that for tha app.use only one milyo
//        vani hunxa tara all ma chahi sabai milnu parxa like app.all("/getallusers")
//      : we can use the app.use for the global error handler and for middlerwares like auth

// app.get('/getallusers' ,(request , response , next)=>{
//     console.log("All the user data has been sent.")
//     next()
// })

// app.use('/' ,(request , response,next)=>{
//     console.log("Hello malai birseko ho??")
//     next()
// })


// database connection should be done before listening the server






// database should be connected before the server started (best practice)

databaseConnection()
.then(()=>{
    console.log("Database has been connected successfully.")
    app.listen(8000 , (request , response)=>{
        console.log("Server has been started.")
    })
})
.catch((err)=>{
    console.log("Database cannot be connected." + err.message)
})