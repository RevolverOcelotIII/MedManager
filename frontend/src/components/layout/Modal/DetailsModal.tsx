"use client";

import { Modal } from "@/src/components/layout/Modal/Modal";
import { DetailsModalProps } from "@/src/types/components/layout/DetailsModal";
import "@/src/styles/components/layout/details-modal.css";

export function DetailsModal<T extends Record<string, any>>({ 
  isOpen, 
  onClose, 
  title, 
  data, 
  columns,
  sections,
  customContent
}: DetailsModalProps<T>) {
  if (!data) return null;

  const renderField = (column: any) => {
    const value = column.render ? column.render(data) : data[column.name];

    if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
      return null;
    }

    let displayValue: React.ReactNode = value;

    if (column.badge && column.options) {
      const optionIndex = column.options.findIndex((opt: any) => opt.value === value);
      const colorIndex = optionIndex !== -1 ? (optionIndex % 10) + 1 : 1;
      const label = column.options.find((opt: any) => opt.value === value)?.label || String(value);
      
      displayValue = (
        <span className={`badge color-${colorIndex}`}>
          {label}
        </span>
      );
    }

    return (
      <div 
        key={column.name} 
        className={`details-field width-${column.width || "50"}`}
      >
        <span className="details-field-label">{column.label}</span>
        <div className="details-field-value">{displayValue}</div>
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      size="lg"
    >
      <div className="details-modal-content">
        {sections ? (
          sections.map((section, index) => {
            const renderedFields = section.fields
              .map(fieldName => columns.find(c => c.name === fieldName))
              .filter(Boolean)
              .map(column => renderField(column))
              .filter(Boolean);

            if (renderedFields.length === 0) return null;

            return (
              <div key={index} className="details-section">
                <h3 className="details-section-title">{section.title}</h3>
                <div className="details-grid">
                  {renderedFields}
                </div>
              </div>
            );
          })
        ) : (
          <div className="details-section">
            <div className="details-grid">
              {columns.filter(c => c.details).map(renderField).filter(Boolean)}
            </div>
          </div>
        )}

        {customContent && (
          <div className="details-custom-content">
            {customContent}
          </div>
        )}
      </div>
    </Modal>
  );
}
