export default function About() {
  return (
    <div className="about-page">
      <p>
        Welcome to our Food Ordering App! This platform is designed to make your
        food ordering experience seamless and enjoyable, thanks to the robust
        technologies and functionalities that power it.
      </p>
      <h4> Technologies and Functionalities Used:</h4>
      <ul>
        <li>
          Front End: Our front end is built using React, providing a dynamic and
          responsive user interface for a smooth user experience.
        </li>
        <li>
          Back End: The back end is powered by Node.jsand Express, ensuring
          efficient and scalable server-side operations.
        </li>
        <li>
          Database: We use MongoDB to store all the essential data, offering
          flexibility and performance for managing our database.
        </li>
        <li>
          Authentication: JWT (JSON Web Tokens) is utilized to create and verify
          tokens, ensuring secure user authentication for sign-in and sign-up
          processes.
        </li>
        <li>
          Protected Routes: Important routes such as cart, orders, and favorites
          are protected and require proper authorization to access. This keeps
          your data secure and ensures a personalized experience.
        </li>
      </ul>
      <p>
        By integrating these cutting-edge technologies, we strive to provide you
        with a reliable, secure, and user-friendly platform for all your food
        ordering needs. Thank you for choosing our app, and we hope you enjoy
        using it as much as we enjoyed building it!
      </p>
      <p>
        <b>Acknowledgement</b>: The design of this website is inspired from
        <a href="https://www.youtube.com/watch?v=bd5DewlahnE" target="_blank">
          Geeks for Geeks Food App tutorial
        </a>
      </p>
    </div>
  );
}
