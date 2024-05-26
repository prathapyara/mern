import bcrypt from "bcryptjs"

export const comparePasswords=(inputPassword,hashedPassword)=>{
    return bcrypt.compareSync(inputPassword,hashedPassword);
}