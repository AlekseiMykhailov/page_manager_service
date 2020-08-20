import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  ButtonGroup,
  Button,
  Grid,
  TextField,
  Checkbox,
  InputLabel,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const useStyles = makeStyles((theme) => ({
  root: {},
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  }
}));

function PageEditForm({
  className,
  pageSchema,
  pageData,
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
      title={pageData.title}
      action={`${API_URL}/pages/${slug}`}
      onSubmit={handleSubmit}
    >
      {Object.values(pageSchema)
        .sort((a, b) => a.order - b.order)
        .map(({ name, label, type }) => {
          if (type === 'checkbox') {
            return (
              <InputLabel htmlFor={name} key={name}>
                <Checkbox
                  id={name}
                  label={label}
                  margin="normal"
                  name={name}
                  variant="outlined"
                  checked={pageData[name]}
                  onChange={handleChange}
                />
                Set as home page
              </InputLabel>
            );
          }

          return (
            <TextField
              fullWidth
              label={label}
              margin="normal"
              name={name}
              disabled={name === 'domain'}
              variant="outlined"
              value={pageData[name]}
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

PageEditForm.defaultProps = {
  className: '',
};

PageEditForm.propTypes = {
  pageSchema: PropTypes.object,
  pageData: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default PageEditForm;
