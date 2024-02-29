# email_sender.py
from dotenv import load_dotenv
load_dotenv()

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from constants.style import container_style, anchor_p_style, anchor_style
import os
import smtplib

def send_email(todo_name):
    app_password = os.environ.get("GOOGLE_APP_PASSWORD")

    sender_email = "paolomartinligsay@gmail.com"
    receiver_email = "meetpaololigsay@gmail.com"
    subject = f"Todo Notification: {todo_name}"

    # Message body with a button and box shadow
    message_body = f"""
    <div style="{container_style}">
        <h1> TODO APP </h1>
        <p style="color: #ffff;"> Congratulations! Your todo list has been successfully updated with the latest changes. Stay on top of your tasks and enjoy the enhanced organization in your workflow. </p>
        <p style="color: #ffff; font-size: 18px; margin-top: 40px; margin-bottom: 40px;"> New Todo: {todo_name} </p>
        <p style="color: #ffff;"> The todo app is a task management tool designed to help users organize their daily activities efficiently. Users can create, prioritize, and track tasks, ensuring a streamlined approach to managing their to-do lists and boosting overall productivity. </p>
        <p style="{anchor_p_style}">
            <a href="http://localhost:3000/" style="{anchor_style}">
                View Todo
            </a>
        </p>
    </div>
    """

    # Combine introduction and main message
    html_message = f"{message_body}"

    # Prepare the email content
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    # Attach HTML content
    html_part = MIMEText(html_message, "html")
    message.attach(html_part)

    # Establish connection with SMTP server
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()

    # Login to the email account
    server.login(sender_email, app_password)

    # Send the email
    server.sendmail(sender_email, receiver_email, message.as_string())

    # Close the connection
    server.quit()
