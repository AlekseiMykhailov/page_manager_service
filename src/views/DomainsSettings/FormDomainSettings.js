import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import {
  Button,
  InputLabel,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  textAreaHeader: {
    width: '100%',
    marginTop: theme.spacing(3),
    textAlign: 'left',
  },
  textArea: {
    borderColor: 'rgba(0,0,0,0.15)',
    resize: 'none',
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
}));

function FormDomainSettings({
  className, fields, handleChange, handleSubmit
}) {
  const classes = useStyles();

  return (
    <form
      className={clsx(classes.root, className)}
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {fields.map(({
        name, description, type, value, options
      }) => {
        if (type === 'select') {
          return (
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
              key={name}
            >
              <InputLabel id={`${name}-label`}>
                {description}
              </InputLabel>
              <Select
                fullWidth
                id={name}
                label={description}
                name={name}
                value={value}
                variant="outlined"
                onChange={handleChange}
              >

                {options.map((option) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }

        if (type === 'textarea') {
          return (
            <React.Fragment key={name}>
              <Typography variant="h4" className={classes.textAreaHeader}>
                {description}
              </Typography>
              <TextareaAutosize
                rows={6}
                className={classes.textArea}
                label={description}
                margin="normal"
                name={name}
                variant="outlined"
                value={value}
                onChange={handleChange}
              />
            </React.Fragment>
          );
        }

        return (
          <TextField
            fullWidth
            label={description}
            margin="normal"
            name={name}
            type={type}
            onChange={handleChange}
            value={value}
            variant="outlined"
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
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            startIcon={<SaveAltIcon />}
          >
            Save Domain Settings
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

FormDomainSettings.propTypes = {
  className: PropTypes.string,
  fields: PropTypes.array,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default FormDomainSettings;
