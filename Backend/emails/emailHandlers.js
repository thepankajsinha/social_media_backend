import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createCommentNotificationEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates.js";

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


export const sendCommentNotificationEmail = async (
	recipientEmail,
	recipientName,
	commenterName,
	postUrl,
	commentContent
) => {
	const recipient = [{ email: recipientEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "New Comment on Your Post",
			html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
			category: "comment_notification",
		});
		console.log("Comment Notification Email sent successfully", response);
	} catch (error) {
		throw error;
	}
};