import React from 'react';
import { Pagination as PCPagination, PcapTheme, Typography } from '@pcapcc360/react-ui';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: PcapTheme) => ({
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
}));

export type PaginationProps = {
  pageSize: number;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  pageSize,
  page,
  totalElements,
  totalPages,
  onPageChange,
}) => {
  const classes = useStyles();
  const fromRecord = pageSize * (page - 1);
  const toRecord = pageSize * page;

  if (totalPages === 1 || totalPages === 0) {
    return null;
  }

  return (
    <div className={classes.pagination}>
      <Typography variant="body1">
        {fromRecord} - {toRecord < totalElements ? toRecord : totalElements} из{' '}
        {totalElements}{' '}
      </Typography>
      <PCPagination
        pageCount={totalPages}
        page={page}
        handleChange={(e, newPage) => newPage !== page && onPageChange(newPage)}
      />
    </div>
  );
};

export default Pagination;
