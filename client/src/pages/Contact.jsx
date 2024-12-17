import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Toast from "../components/Toast";

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isError: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_3odxlyw", "template_dmzt1q8", form.current, {
        publicKey: "6999yVZk83cbkufbG",
      })
      .then(
        () => {
          console.log("SUCCESS!");

          setToast({
            message: "Message sent!",
            isVisible: true,
            isError: false,
          });
        },
        (error) => {
          console.log("FAILED...", error.text);
          setToast({
            message: "There was an error. Please try again",
            isVisible: true,
            isError: true,
          });
        }
      );
    setFormData({
      from_name: "",
      from_email: "",
      message: "",
    });
  };

  return (
    <>
      <div className="contact-page">
        <h2>Get In Touch</h2>
        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <input
            type="text"
            name="from_name"
            placeholder="Name"
            value={formData.from_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="from_email"
            placeholder="Email"
            value={formData.from_email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send</button>
        </form>
        <p>
          Or, you can reach me directly by
          <a href="mailto:singamet@outlook.com">Email</a>
        </p>
      </div>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        isError={toast.isError}
        onClose={() =>
          setToast({ message: "", isVisible: false, isError: false })
        }
      />
    </>
  );
};
export default Contact;
