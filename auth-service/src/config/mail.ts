import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"
import { _env } from "."

const transporter = nodemailer.createTransport({
    host:_env.MAIL_HOST,
    port: Number(_env.MAIL_PORT),
    auth: _env.NODE_ENV === "production" ? {
        user: _env.MAIL_USER,
        pass: _env.MAIL_PASS
    } : undefined
})

const sendMail = async (to:string,subject:string,templateName:string,data:Record<string,any>) =>  {
    try {
        const html = await renderEmailTemplate(templateName,data);
        await transporter.sendMail({
            from:`<${_env.SMTP_USER}>`,
            to,
            subject,
            html
        })
        return true
    } catch (error) {
        console.log(error)
        return false  
    }
}
const renderEmailTemplate = async (templateName: string, data: Record<string, any>) => {
    const templatePath = path.join(
        process.cwd(),
        "src",
        "utils",
        "email-templates",
        `${templateName}.ejs`
    )

    return ejs.renderFile(templatePath,data);
};




export default transporter;
export { sendMail ,renderEmailTemplate};