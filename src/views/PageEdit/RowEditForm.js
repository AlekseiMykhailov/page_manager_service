import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonGroup,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  colors,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  divider: {
    backgroundColor: colors.grey[300],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  deleteButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    }
  }
}));

function RowEditContainer({
  row,
  index,
  maxIndex,
  className,
  handleSubmit,
  handleInputChange,
  handleChangeOrder,
  handleDelete,
}) {
  const { id, fields, schema } = row;
  const API_URL = process.env.REACT_APP_API_URL;
  const classes = useStyles();

  return (
    <form
      id={id}
      action={`${API_URL}/rows/${id}`}
      data-row-id={id}
      noValidate
      autoComplete="off"
      className={className}
      onSubmit={handleSubmit}
    >
      <Divider className={classes.divider} />
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography
            gutterBottom
            variant="h4"
          >
            {schema}
          </Typography>
        </Grid>
        <Grid item>
          {(maxIndex > 0) && (
            <div className={classes.root}>
              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button
                  data-row-id={id}
                  data-direction="up"
                  disabled={index === 0}
                  onClick={handleChangeOrder}
                >
                  <ArrowUpwardIcon />
                </Button>
                <Button
                  data-row-id={id}
                  data-direction="down"
                  disabled={index === maxIndex}
                  onClick={handleChangeOrder}
                >
                  <ArrowDownwardIcon />
                </Button>
              </ButtonGroup>
            </div>
          )}
        </Grid>
      </Grid>
      {fields && fields.map(({ name, type, value }) => (
        <TextField
          fullWidth
          id={`${id}-${name}`}
          inputProps={{ 'data-row-id': id }}
          label={name}
          margin="normal"
          name={name}
          type={type}
          variant="outlined"
          value={value}
          onChange={handleInputChange}
          key={name}
        />
      ))}
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
      >
        <ButtonGroup
          variant="contained"
          className={classes.buttonGroup}
          size="small"
          color="primary"
          aria-label="contained primary button group"
        >
          <Button
            variant="contained"
            className={classes.deleteButton}
            data-row-id={id}
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete Row
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveAltIcon />}
            color="primary"
          >
            Save Row
          </Button>
        </ButtonGroup>
      </Grid>
    </form>
  );
}

RowEditContainer.defaultProps = {
  className: '',
};

RowEditContainer.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fields: PropTypes.array,
    schema: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
  index: PropTypes.number.isRequired,
  maxIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleChangeOrder: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default RowEditContainer;
