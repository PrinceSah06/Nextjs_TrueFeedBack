import mongoose,{Document} from "mongoose";

type ConnectionObject ={
    isConnencted?:number,

}
const connection :ConnectionObject={
     
}

async function dbConnect():Promise<void> {
    if(connection.isConnencted){
        console.log("Already connected to database")
        return 
    }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }
    try {

       const db =   await mongoose.connect(process.env.MONGODB_URI||" ")
         
connection.isConnencted= db.connections[0].readyState

console.log("Db Connected Succesfully ")




    } catch (error) {
        console.log('db connection is failed ',error)
        process.exit(1)

        
    }
    
}
export default dbConnect
//1.07.01