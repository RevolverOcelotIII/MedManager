import { Header } from "@/src/components/layout/Header";
import { GridPageContainer } from "@/src/components/layout/GridPage/GridPageContainer";
import { GridPageHeader } from "@/src/components/layout/GridPage/GridPageHeader";
import { Grid } from "@/src/components/layout/Grid/index";
import { GridPageProps } from "@/src/types";

export function GridPage<T>({
  title,
  description,
  data,
  columns,
  rowKey,
  searchValue,
  onSearchChange,
  onNewClick,
  newButtonLabel,
  extraActions,
  breadcrumb,
}: GridPageProps<T>) {
  return (
    <div className="grid-page-layout">
      <Header breadcrumb={breadcrumb} />
      <GridPageContainer>
        <GridPageHeader
          title={title}
          description={description}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onNewClick={onNewClick}
          newButtonLabel={newButtonLabel}
          extraActions={extraActions}
        />
        <Grid
          data={data}
          columns={columns}
          rowKey={rowKey}
        />
      </GridPageContainer>
    </div>
  );
}
