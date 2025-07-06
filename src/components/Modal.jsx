// components/Modal.jsx
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  gap: 1rem;
  max-width: 500px;
  width: 80%;
`;

export default function Modal({
  isOpen,
  onClose,
  children,
  usePortal = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  const content = (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>{children}</Dialog>
    </Overlay>
  );

  return usePortal ? createPortal(content, document.body) : content;
}
