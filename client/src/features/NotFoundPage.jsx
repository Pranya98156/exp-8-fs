import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <section className="card fade-in" style={{ textAlign: "center" }}>
    <p className="kicker">Page not found</p>
    <h2>Oops, that route does not exist.</h2>
    <p className="subtle">
      Head back to the home screen and continue exploring your secure app.
    </p>
    <Link to="/" className="btn primary" style={{ marginTop: "1rem" }}>
      Back to Home
    </Link>
  </section>
);
