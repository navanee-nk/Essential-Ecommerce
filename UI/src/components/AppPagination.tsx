import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props {
  metaData: MetaData;
  onChange: (pageNumber: number) => void;
}

const AppPagination = ({ metaData, onChange }: Props) => {
  const { currentPage, totalCount, totalPages, pageSize } = metaData;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography>
        Displaying {(currentPage - 1) * pageSize + 1}-
        {currentPage * pageSize > totalCount
          ? totalCount
          : currentPage * pageSize}
        of {totalCount} items
      </Typography>
      <Pagination
        color="secondary"
        size="large"
        count={totalPages}
        page={currentPage}
        onChange={(_e, page) => onChange(page)}
      ></Pagination>
    </Box>
  );
};

export default AppPagination;
