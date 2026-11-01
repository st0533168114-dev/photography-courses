import { useEffect, useState } from "react";
import styles from "../css/components/WellcomeSection.module.css";

const CLOUDINARY_BASE = "https://res.cloudinary.com/tcs2p8ac/image/upload/w_1920,c_limit,q_auto,f_webp";

const images = [
  `${CLOUDINARY_BASE}/v1792076553/1Q3A9517_-_%D7%A2%D7%95%D7%AA%D7%A7-Y2flmcgv.jpg`,
  `${CLOUDINARY_BASE}/v1792076551/1Q3A8836-DgVUDjjl.jpg`,
  `${CLOUDINARY_BASE}/v1792076551/1Q3A9257_copy-Cwll_37m.jpg`,
  `${CLOUDINARY_BASE}/v1792076550/1Q3A0424_copy-D5qj4py7.jpg`,
  `${CLOUDINARY_BASE}/v1792076549/1Q3A0466_-_%D7%A2%D7%95%D7%AA%D7%A7-D_4uYDxJ.jpg`,
  `${CLOUDINARY_BASE}/v1792076549/1Q3A2771_copy-B2GuQsis.jpg`,
  `${CLOUDINARY_BASE}/v1792076549/469A3703-CSYFhqnp.jpg`,
  `${CLOUDINARY_BASE}/v1792076549/1Q3A1715-BO7esbxm.jpg`,
];

export default function WellcomeSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={styles.section}
      style={{
        backgroundImage: `url(${images[currentImage]})`,
      }}
    >
      <div className={styles.overlay}>
        <h2 className={styles.title}>
          בואי להגשים את החלום שלך
          <br />
          עם קורס דיגיטלי לצילום
        </h2>
      </div>
    </section>
  );
}
