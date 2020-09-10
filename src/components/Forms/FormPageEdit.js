import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  ButtonGroup,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const useStyles = makeStyles((theme) => ({
  root: {},
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  }
}));

function FormPageEdit({
  className,
  fields,
  handleSubmit,
  handleChange,
}) {
  const { slug } = useParams();
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <form
      id="wep-page-data-form"
      className={className}
      action={`${API_URL}/pages/${slug}`}
      onSubmit={handleSubmit}
    >
      {fields.sort((a, b) => a.order - b.order)
        .map(({
          name, description, type, value
        }) => {
          if (type === 'checkbox') {
            return (
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={value}
                    onChange={handleChange}
                    name={name}
                    color="primary"
                  />
                  )}
                label={description}
                key={name}
              />
            );
          }

          return (
            <TextField
              fullWidth
              label={description}
              margin="normal"
              name={name}
              type={type}
              disabled={name === 'domain'}
              variant="outlined"
              value={value}
              onChange={handleChange}
              key={name}
            />
          );
        })}
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="center"
      >
        <Grid item>
          <ButtonGroup
            variant="contained"
            size="small"
            aria-label="small outlined button group"
            className={classes.buttonGroup}
          >
            <Button
              className={classes.submitButton}
              color="primary"
              type="submit"
              variant="contained"
              startIcon={<SaveAltIcon />}
            >
              Save Page Meta
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>

    </form>
  );
}

FormPageEdit.defaultProps = {
  className: '',
};

FormPageEdit.propTypes = {
  fields: PropTypes.array.isRequired,
  className: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default FormPageEdit;
