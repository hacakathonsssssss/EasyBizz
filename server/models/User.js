import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
            min: 10,
            max: 10,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        address: {
            type: String,
            min: 10,
        },
        addressProof: {
            type: String,
            default: "",
        },
        passport: {
            type: String,
            default: "",
        },
        license: {
            type: String,
            default: "",
        },
        passbook: {
            type: String,
            default: "",
        },
        companyName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
            unique: true,
        },
        companyType:String,
        companyAddress: {
            type: String,
            min: 10,
        },
        employeeCount: Number,
        currentStage: Number,
        rentAgreement: {
            type: String,
            default: "",
        },
        moa: {
            type: String,
            default: "",
        },
    },
    {timestamps: true}
);

const User = mongoose.model("User",UserSchema);
export default User;
