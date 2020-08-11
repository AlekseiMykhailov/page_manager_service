import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  ButtonGroup,
  Button,
  Divider,
  Fab,
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
import AddIcon from '@material-ui/icons/Add';

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
  },
  fab: {
    alignSelf: 'flex-end',
  },
}));

function RowEditContainer({
  row,
  index,
  maxIndex,
  className,
  schemas,
  handleSubmit,
  handleInputChange,
  handleChangeOrder,
  handleDelete,
  handleAddField,
}) {
  const { id, fields, schemaId } = row;
  const sortedFields = fields.sort((a, b) => a.order - b.order);
  const fieldsMap = sortedFields.reduce((map, field) => ({
    ...map,
    [field.name]: field.value,
  }), {});
  const schema = schemas.find((rowSchema) => rowSchema.id === schemaId);
  const API_URL = process.env.REACT_APP_API_URL;
  const classes = useStyles();

  return (
    <>
      <Divider className={classes.divider} />
      <form
        id={id}
        action={`${API_URL}/rows/${id}`}
        data-row-id={id}
        noValidate
        autoComplete="off"
        className={clsx(classes.root, className)}
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
              {schema && schema.meta.title}
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
        {sortedFields.map(({ name, type, label }) => (
          <TextField
            fullWidth
            id={`${id}-${name}`}
            inputProps={{ 'data-row-id': id }}
            label={label}
            margin="normal"
            name={name}
            type={type}
            variant="outlined"
            value={fieldsMap[name]}
            onChange={handleInputChange}
            key={name}
          />
        ))}
        {schema && schema.fields.some((field) => field.clonable) && (
          <Fab
            data-row-id={id}
            color="primary"
            aria-label="add"
            className={classes.fab}
            onClick={handleAddField}
          >
            <AddIcon />
          </Fab>
        )}
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
    </>
  );
}

RowEditContainer.defaultProps = {
  className: '',
};

RowEditContainer.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    schemaId: PropTypes.string.isRequired,
    fields: PropTypes.array,
  }),
  index: PropTypes.number.isRequired,
  maxIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
  schemas: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleChangeOrder: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleAddField: PropTypes.func.isRequired,
};

export default RowEditContainer;
