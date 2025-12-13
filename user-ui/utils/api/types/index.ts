export interface IUserRegister {
    name: string,
    email: string,
    password: string
}

export interface IUserLogin {
    email: string,
    password: string
}

export interface IOtpVerify {
    otp: string
    token: string
}

