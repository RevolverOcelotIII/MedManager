import { GridPageContainerProps } from "@/src/types";
import "@/src/styles/components/layout/grid-page.css";

export function GridPageContainer({ children }: GridPageContainerProps) {
  return (
    <main className="grid-page-container">
      <div className="inner">
        {children}
      </div>
    </main>
  );
}
