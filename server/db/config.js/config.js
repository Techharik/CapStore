import { connect } from "mongoose";



const dbConnect = async()=>{
    try {
        const conn = await connect(process.env.DATABASE_URI)
        console.log('connected to database'+conn)
    } catch (error) {
        console.log('error in connecting to database', error)
    }
}

export default dbConnect;