// React
import { Link } from "react-router";
// Components
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
// Styles
import styles from "./NotFound.module.css"

export default function NotFound() {
  return (
    <div className="wrapper">
      <Header />
      <main className={["padding-inline", styles.mainWrapper].join(" ")}>
        <div className={styles.wrapper}>
          <p>
            Page not found. <Link to="/">Back to home?</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

