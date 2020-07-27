import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  ButtonGroup,
  Button,
  Grid,
  TextField,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const useStyles = makeStyles((theme) => ({
  root: {},
  buttons: {
    marginTop: theme.spacing(2)
  }
}));

function PageDataForm({
  pageData,
  className,
  handleSubmit,
  handleChange,
  handleReset,
}) {
  const { slug } = useParams();
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <form
      id="wep-page-data-form"
      className={className}
      title={pageData.title}
      action={`${API_URL}/pages/${slug}`}
      onSubmit={handleSubmit}
    >
      {Object.entries(pageData).map(([fieldName, fieldValue]) => {
        if (fieldName === 'title' || fieldName === 'description' || fieldName === 'slug') {
          return (
            <TextField
              fullWidth
              label={fieldName}
              margin="normal"
              name={fieldName}
              disabled={fieldName === 'slug'}
              variant="outlined"
              value={fieldValue}
              onChange={handleChange}
              key={fieldName}
            />
          );
        }

        return '';
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
            className={classes.buttons}
          >
            <Button
              className={classes.resetButton}
              fullWidth
              variant="contained"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className={classes.submitButton}
              color="primary"
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<SaveAltIcon />}
            >
              Save changes
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>

    </form>
  );
}

PageDataForm.defaultProps = {
  className: '',
};

PageDataForm.propTypes = {
  pageData: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
};

export default PageDataForm;
