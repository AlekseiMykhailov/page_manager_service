import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  ButtonGroup,
  Button,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const useStyles = makeStyles((theme) => ({
  root: {},
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
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
      <Typography gutterBottom variant="h3">
        {pageData.title}
      </Typography>
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
            className={classes.buttonGroup}
          >
            <Button
              className={classes.resetButton}
              variant="contained"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className={classes.submitButton}
              color="primary"
              type="submit"
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
