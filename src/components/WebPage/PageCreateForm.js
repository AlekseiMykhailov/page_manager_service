import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  submitButton: {
    marginTop: theme.spacing(2)
  },
}));

function FormPageCreate({
  className,
  pageSchema,
  pageData,
  domains,
  handleChange,
  handleSubmit,
}) {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        {pageSchema && pageData && (
          <form autoComplete="off" onSubmit={handleSubmit}>
            {Object.values(pageSchema)
              .sort((a, b) => a.order - b.order)
              .map(({ name, label, type }) => {
                if (name === 'domain') {
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
                        value={pageData[name]}
                        variant="outlined"
                        onChange={handleChange}
                      >
                        {domains.map((domain) => (
                          <MenuItem value={domain.domain} key={domain.id}>
                            {`${domain.name} (${domain.domain})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                return (
                  <TextField
                    fullWidth
                    label={label}
                    margin="normal"
                    name={name}
                    type={type}
                    onChange={handleChange}
                    value={pageData[name]}
                    variant="outlined"
                    key={name}
                  />
                );
              })}
            <Button
              className={classes.submitButton}
              color="primary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={!pageData.domain || !pageData.slug || !pageData.title}
            >
              Create Page
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

FormPageCreate.propTypes = {
  className: PropTypes.string,
  pageSchema: PropTypes.object,
  pageData: PropTypes.object,
  domains: PropTypes.array,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default FormPageCreate;
