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
      to: email.value,
      body: message.value,
    };
    try
    {
    let response = await fetch("http://localhost:7071/api/EmailNotifier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(details),
    });
    alert("Email Send Request Status " + response.statusText + " With Status Code: " + response.status);
    }
    catch(e){
      console.log('Request Error:', e);   
      alert("An Error occured while sending email");     
    }
    finally{
      setStatus("Submit");
    }
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