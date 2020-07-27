import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonGroup,
  Button,
  Grid,
  TextField,
  Typography,
  colors,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

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
  const { id, fields, meta } = row;
  const API_URL = process.env.REACT_APP_API_URL;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    buttonGroup: {
      margin: '2rem 0',
    },
    deleteButton: {
      color: theme.palette.common.white,
      backgroundColor: colors.red[600],
      '&:hover': {
        backgroundColor: colors.red[900]
      }
    }
  }));

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
            {meta.title}
          </Typography>
        </Grid>
        <Grid item>
          {maxIndex && (
            <div className={classes.root}>
              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button
                  data-row-id={id}
                  data-direction="up"
                  disabled={index === 0}
                  onClick={handleChangeOrder}
                >
                  &uarr;
                </Button>
                <Button
                  data-row-id={id}
                  data-direction="down"
                  disabled={index === maxIndex}
                  onClick={handleChangeOrder}
                >
                  &darr;
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
    id: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    meta: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired,
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
