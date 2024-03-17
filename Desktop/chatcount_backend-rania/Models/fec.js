
import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const  fecSchema = new Schema({

    name:{
            type: String
        },
        data:{
            type: String
        },
     
    },
    {
        timestamp:true
    }
);

export default mongoose.model('Fec',fecSchema);