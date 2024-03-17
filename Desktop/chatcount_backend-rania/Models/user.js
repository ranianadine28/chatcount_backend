import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const UserSchema = new Schema({

    name:{
            type: String
        },
        email:{
            type: String
        },
        password:{
            type: String
        },
       
        phone:{
            type: String
        },
        role:{
            type: String
        },
        //doctor's speciality
        speciality:{
            type: String
        },
        address:{
            type: String
        },
        nickName:{
            type: String
        },
        token:{
            type: String
        },
        avatar:{
            type: String
        }
        
        
       
        
    },
    {
        timestamp:true
    }
);

export default mongoose.model('user',UserSchema);