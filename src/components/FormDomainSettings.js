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
  TextField,
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
        name, label, type, value, options
      }) => {
        if (type === 'select') {
          if (type === 'select') {
            return (
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
                key={name}
              >
                <InputLabel id={`${name}-label`}>
                  {label}
                </InputLabel>
                <Select
                  fullWidth
                  id={name}
                  label={label}
                  name={name}
                  value={value}
                  variant="outlined"
                  onChange={handleChange}
                >

                  {options.map((option) => (
                    <MenuItem value={option.value} key={option.value}>
                      {option.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }
        }

        return (
          <TextField
            fullWidth
            label={label}
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
            Save
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
