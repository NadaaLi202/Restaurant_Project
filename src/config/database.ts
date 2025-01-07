import mongoose from "mongoose";

const dbConnection: () => void = () : void  =>{

    // mongoose.connect('mongodb+srv://nadaali2:nadaali@cluster0.sliiz.mongodb.net/cafe?retryWrites=true&w=majority&appName=Cluster0')
    mongoose.connect(process.env.DB!)
    .then(() : void => {
        console.log("DB connected successfully")
    })
    .catch((err : any) : void=> {

        console.log("Error connecting to DB", err)
    } )
}

export default dbConnection;