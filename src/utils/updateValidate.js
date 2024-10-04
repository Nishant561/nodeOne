const validator = require("validator")

exports.updateValidate = (req)=>{

    const allowedField = [
        "firstName",
        "age",
        "skills"
    ]

    const isAllowed = Object.keys(req).every(fields => allowedField.includes(fields))

    return isAllowed

}


exports.emailValidate = async(email)=>{
    return await validator.isEmail(email)
}