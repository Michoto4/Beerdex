import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import ENV from '../config.js';

/** POST: http://localhost:8080/api/registerMail
@param : {
"username" : "example123",
"userEmail" : "example@mail.com",
"text" : "example Text",
"subject" : "example Subject"
}

*/
export async function sendMail(req, res) {
    const { username, userEmail, text, subject, html } = req.body;
    // return res.status(200).send(`TESTING RESPONSE`);

    const mailerSend = new MailerSend({
      apiKey: ENV.MAILERSEND_API_KEY,
    });
    
    try { 
      

      const sentFrom = new Sender("noreply@beerdex.pl", "Beerdex");

      const recipients = [
        new Recipient(userEmail, username)
      ];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(subject)
        .setHtml(html)
        .setText(text);

      await mailerSend.email.send(emailParams);
      return res.status(200).send({msg: 'Email sent!'})
      

      } catch (error) {
        return res.status(500).send({error})
      }

}