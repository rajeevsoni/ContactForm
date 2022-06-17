import React, { useState } from "react";
import './App.css';

const ContactForm = () => {
  const [status, setStatus] = useState("Submit");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const { subject, email, message } = e.target.elements;
    let details = {
      subject: subject.value,
      email: email.value,
      message: message.value,
    };
    let response = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(details),
    });
    setStatus("Submit");
    let result = await response.json();
    alert(result.status);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Contact Form</h2>
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" id="email" required />
      </div>
      <br/>
      <div>
        <label  className="label">Subject</label>
        <input className ="input" type="text" id="subject" required />
      </div>
      <br/>
      <div>
        <label  className="label">Message</label>
        <textarea className="textarea" id="message" required />
      </div>
      <br/>
      <button className="btn btn-primary" type="submit">{status}</button>
    </form>
  );
};

export default ContactForm;