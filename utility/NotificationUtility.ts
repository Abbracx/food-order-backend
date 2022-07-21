// Email

import { ACCOUNT_SID, AUTH_TOKEN } from "../config"


export const generateOTP = async () => {
    // generate six digits otp number
    const otp = Math.floor(100000 + Math.random() * 900000)

    let expiry = new Date()
    // add 30 min extra to expiry date and return the otp and expiry
    expiry.setTime( new Date().getTime() + (30 * 60 * 1000))

    return { otp, expiry }
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    /*
    auth_token, accountSid and virtual phone are all from twilio
    */
    const accountSid = ACCOUNT_SID || ''
    const authToken = AUTH_TOKEN || ''
    const client = require('twilio')(accountSid, authToken)

    const resp = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+19475006735',
        to: toPhoneNumber
    })
    return resp
}