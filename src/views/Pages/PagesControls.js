import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  InputLabel,
  Grid,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import Search from 'src/components/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  item: {
    marginLeft: theme.spacing(1),
  },
}));

function PagesControls({
  className,
  sortTypes,
  pagesOrder,
  handleSortType,
  handleSearchQuery,
}) {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      direction="row"
      justify="flex-end"
    >
      <Grid item xs={3} className={classes.item}>
        <Search handleChange={handleSearchQuery} />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="new-row-schema-label">Sort Type</InputLabel>
          <Select
            labelId="new-row-schema-label"
            id="new-row-schema"
            value={pagesOrder.type}
            onChange={handleSortType}
            label="Section Schema"
            fullWidth
          >
            {sortTypes.map((sortType) => (
              <MenuItem value={sortType.type} key={sortType.type}>
                {sortType.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

PagesControls.propTypes = {
  className: PropTypes.string,
  sortTypes: PropTypes.array,
  pagesOrder: PropTypes.object,
  handleSortType: PropTypes.func,
  handleSearchQuery: PropTypes.func,
};

export default PagesControls;
