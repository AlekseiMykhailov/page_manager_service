import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from '@material-ui/core';
import { SaveAlt } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  textAreaHeader: {
    width: '100%',
    marginTop: theme.spacing(1),
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

function InstructorForm({
  className,
  schema,
  actionType,
  handleChange,
  handleSubmit,
}) {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        <form
          noValidate
          autoComplete="off"
          className={classes.form}
          onSubmit={handleSubmit}
        >
          {schema.map(({
            name, type, description, value
          }) => (
            <TextField
              fullWidth
              label={description}
              margin="normal"
              name={name}
              type={type}
              variant="outlined"
              value={value}
              onChange={handleChange}
              key={name}
            />
          ))}
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
                startIcon={<SaveAlt />}
              >
                {actionType === 'create' && 'Create Instructor'}
                {actionType === 'edit' && 'Save Instructor Data'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

InstructorForm.propTypes = {
  className: PropTypes.string,
  schema: PropTypes.array,
  actionType: PropTypes.string,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default InstructorForm;
