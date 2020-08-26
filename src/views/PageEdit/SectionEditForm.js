import React from 'react';
import PropTypes from 'prop-types';
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
  root: {},
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  divider: {
    height: '4px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  deleteButton: {
    color: colors.red[600],
    borderColor: colors.red[600],
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: colors.red[600]
    }
  },
  fab: {
    alignSelf: 'flex-end',
  },
}));

function SectionEditForm({
  section,
  index,
  maxIndex,
  schemas,
  handleSubmit,
  handleInputChange,
  handleChangeOrder,
  handleDelete,
  handleAddField,
}) {
  const { id, fields, name } = section;
  const sortedFields = fields.sort((a, b) => a.order - b.order);
  const fieldsMap = sortedFields.reduce((map, field) => ({
    ...map,
    [field.name]: field.value,
  }), {});
  const currentSchema = schemas.find((schema) => schema.name === name);
  const API_URL = process.env.REACT_APP_API_URL;
  const classes = useStyles();

  

  return (
    <>
      <Divider className={classes.divider} />
      <form
        id={id}
        action={`${API_URL}/sections/${id}`}
        data-section-id={id}
        noValidate
        autoComplete="off"
        className={classes.form}
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
              {currentSchema && currentSchema.title}
            </Typography>
          </Grid>
          <Grid item>
            {(maxIndex > 0) && (
            <div className={classes.root}>
              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button
                  data-section-id={id}
                  data-direction="up"
                  disabled={index === 0}
                  onClick={handleChangeOrder}
                >
                  <ArrowUpwardIcon />
                </Button>
                <Button
                  data-section-id={id}
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
            inputProps={{ 'data-section-id': id }}
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
        {currentSchema && currentSchema.fields.some((field) => field.clonable) && (
          <Fab
            data-section-id={id}
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
            className={classes.buttonGroup}
            size="small"
            aria-label="contained primary button group"
          >
            <Button
              variant="outlined"
              className={classes.deleteButton}
              data-section-id={id}
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete Section
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveAltIcon />}
              color="primary"
            >
              Save Section
            </Button>
          </ButtonGroup>
        </Grid>
      </form>
    </>
  );
}

SectionEditForm.propTypes = {
  section: PropTypes.object,
  index: PropTypes.number.isRequired,
  maxIndex: PropTypes.number.isRequired,
  schemas: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleChangeOrder: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleAddField: PropTypes.func.isRequired,
};

export default SectionEditForm;
