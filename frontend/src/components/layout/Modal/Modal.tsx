"use client";

import { MdClose } from "react-icons/md";
import { ModalProps } from "@/src/types/components/layout/Modal/Modal";
import "@/src/styles/components/layout/modal.css";

export function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>
        </header>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <footer className="modal-footer">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
