import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const app = express();

app.use(express.urlencoded());
app.use(express.json());

dotenv.config();

app.post('/email', async (req, res) => {
  const to = req.body.to;
  const from = req.body.from;
  const subject = req.body.subject;
  const content = req.body.content;

  console.log('receive request ')
  console.log('to ', to)
  console.log('from ', from)
  console.log('subject ', subject)
  console.log('content ', content)
  let transporter;
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: content
  };

  try {
    transporter = nodemailer.createTransport({
      service: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
  } catch (err) {
    console.log("transporter err ",err)
    res.status(500).json({ message: 'Failed to send email' });
  }

  try {
    const sendEmail = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.log("send err ",err)
    res.status(500).json({ message: 'Failed to send email' });
  }

});

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});