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

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

function Controls({
  className,
  sortTypes,
  pagesOrder,
  setPagesOrder,
}) {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      direction="row"
      justify="flex-end"
    >
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="new-row-schema-label">Sort Type</InputLabel>
          <Select
            labelId="new-row-schema-label"
            id="new-row-schema"
            value={pagesOrder.type}
            onChange={setPagesOrder}
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

Controls.propTypes = {
  className: PropTypes.string,
  sortTypes: PropTypes.array,
  pagesOrder: PropTypes.object,
  setPagesOrder: PropTypes.func,
};

export default Controls;
