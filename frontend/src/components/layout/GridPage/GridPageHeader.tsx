import { MdSearch, MdAdd } from "react-icons/md";
import { GridPageHeaderProps } from "@/src/types";
import { i18n } from "@/src/lib/i18n";
import "@/src/styles/components/layout/grid-page.css";

export function GridPageHeader({
  title,
  description,
  searchValue,
  onSearchChange,
  onNewClick,
  newButtonLabel = i18n.t("common.new"),
  extraActions,
}: GridPageHeaderProps) {
  return (
    <div className="grid-page-header">
      <div className="title-container">
        <h1 className="title">{title}</h1>
        {description && (
          <p className="description">{description}</p>
        )}
      </div>
      <div className="actions">
        {(onSearchChange || searchValue !== undefined) && (
          <div className="search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder={i18n.t("common.search")}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="search-input"
            />
          </div>
        )}
        {extraActions}
        {onNewClick && (
          <button
            onClick={onNewClick}
            className="new-button"
          >
            <MdAdd size={16} />
            {newButtonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
