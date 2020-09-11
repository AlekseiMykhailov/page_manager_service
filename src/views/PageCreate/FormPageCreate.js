import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
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
  pageFields,
  domains,
  isAllowCreate,
  handleChange,
  handleSubmit,
}) {
  const classes = useStyles();

  const ogDefault = pageFields && pageFields.find((field) => field.name === 'ogDefault').value;
  const ogTitleDefault = useMemo(() => (
    pageFields && pageFields.find((field) => field.name === 'title').value
  ), [pageFields]);
  const ogDescriptionDefault = useMemo(() => (
    pageFields && pageFields.find((field) => field.name === 'description').value
  ), [pageFields]);

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        {pageFields && domains.length > 0 && (
          <form autoComplete="off" onSubmit={handleSubmit}>
            {pageFields.sort((a, b) => a.order - b.order)
              .map(({
                name, description, type, value
              }) => {
                let correctedValue = value;

                if (name === 'ogTitle' && ogDefault) {
                  correctedValue = ogTitleDefault;
                }

                if (name === 'ogDescription' && ogDefault) {
                  correctedValue = ogDescriptionDefault;
                }

                if (name === 'domain') {
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
                        {domains.map((domain) => (
                          <MenuItem value={domain.domain} key={domain.id}>
                            {`${domain.name} (${domain.domain})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

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
                    onChange={handleChange}
                    value={correctedValue}
                    disabled={(name === 'ogTitle' || name === 'ogDescription') && ogDefault}
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
              disabled={!isAllowCreate}
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
  pageFields: PropTypes.array,
  domains: PropTypes.array,
  isAllowCreate: PropTypes.bool,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default FormPageCreate;
