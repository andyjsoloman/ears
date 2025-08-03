// UploadFormWrapper.tsx

"use client";

import { motion } from "framer-motion";

import UploadForm from "./UploadForm";
import styled from "styled-components";

type Props = {
  location: { lat: number; lng: number } | null;
  onClose: () => void;
};

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

export default function UploadFormWrapper({ location, onClose }: Props) {
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
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "transparent",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
        aria-label="Close"
      >
        <Icon src="/x-circle-blue.svg" alt="Close Form" />
      </button>
      {location && <UploadForm location={location} />}
    </motion.div>
  );
}
