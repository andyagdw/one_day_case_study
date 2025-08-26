// Styles
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={[styles.footer, "padding-inline"].join(" ")}>
      <p>
        &copy; {new Date().getFullYear()}. All Rights Reserved By Pizza Hut.
      </p>
    </footer>
  );
}
