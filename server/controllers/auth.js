import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER 

export const register = async (req,res) => {
    try{
        const{
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            address,
            addressProof,
            passport,
            license,
            passbook,
            companyName,
            companyType,
            companyAddress,
            employeeCount,
            currentStage,
            rentAgreement,
            moa,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt); 

        const newUser = new User({
            
        })
    }
    catch{

    }
}