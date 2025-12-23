export interface ISellerRegister {
    name: string,
    email: string,
    password: string,
    country: string,
    phone_number: string,
}

export interface ISetupSeller {
    businessName: string,
    businessBio: string,
    address: string,
    openingHours: string,
    website: string,
    category: string
}

export interface IUserLogin {
    email: string,
    password: string
}

export interface IOtpVerify {
    otp: string
    token: string
}

export interface IResetPassword{
    token: string,
    newPassword: string
}

