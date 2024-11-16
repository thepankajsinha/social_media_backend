import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to ProConnect!",
            html : createWelcomeEmailTemplate(name, profileUrl),
            category : "welcome",
        })
        console.log("Email sent successfully:", response)
    } catch (error) {
        console.error("Error sending email:", error.message)
    }
}