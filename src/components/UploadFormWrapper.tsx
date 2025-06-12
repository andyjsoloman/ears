// UploadFormWrapper.tsx

"use client";

import { motion } from "framer-motion";
import UploadForm from "./UploadForm";

type Props = {
  location: { lat: number; lng: number } | null;
};

export default function UploadFormWrapper({ location }: Props) {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={location ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        padding: "1rem",
        borderTopLeftRadius: "1rem",
        borderTopRightRadius: "1rem",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
      }}
    >
      {location && <UploadForm location={location} />}
    </motion.div>
  );
}
