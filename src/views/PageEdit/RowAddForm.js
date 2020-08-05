import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  ButtonGroup,
  Button,
  Divider,
  InputLabel,
  Grid,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  colors
} from '@material-ui/core';
import * as FETCH from 'src/utils/fetch';
import * as CONST from 'src/utils/const';
import { setStatusMessage, removeStatusMessage } from 'src/actions/messageActions';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const useStyles = makeStyles((theme) => ({
  root: {},
  divider: {
    backgroundColor: colors.grey[300],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  buttonGroup: {
    margin: '2rem 0',
  },
}));

function RowAddForm({
  pageId, className, newRowOrder, getPageData
}) {
  const [rowSchemas, setRowSchemas] = useState([]);
  const [selectedRowSchemaId, setSelectedRowSchemaId] = useState('');
  const [selectedRowSchema, setSelectedRowSchema] = useState();

  const dispatch = useDispatch();
  const { slug } = useParams();
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const getRowSchemas = useCallback(() => {
    FETCH.getData(
      `${API_URL}/schemas/rows`,
    ).then((response) => {
      if (response.ok) {
        setRowSchemas(response.schemas);
      } else if (response.error) {
        console.log(response.error);
      }
    });
  }, [API_URL]);

  useEffect(() => {
    getRowSchemas();
  }, [getRowSchemas]);

  const handleStatusMessage = (status, text) => {
    dispatch(setStatusMessage(status, text));

    setTimeout(() => {
      dispatch(removeStatusMessage());
    }, CONST.TIME_VISIBILITY_MESSAGES);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    FETCH.postData(
      `${API_URL}/rows`,
      selectedRowSchema,
    ).then((response) => {
      if (response.ok) {
        setSelectedRowSchemaId('');
        setSelectedRowSchema('');
        getPageData(slug);
        handleStatusMessage(CONST.SUCCESS, 'Row was added');
      } else {
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSelectedRowSchema({
      ...selectedRowSchema,
      fields: [...selectedRowSchema.fields].map((field) => {
        if (field.name === name) {
          return {
            ...field,
            value,
          };
        }

        return field;
      }),
    });
  };

  const handleSelectRowSchema = (e) => {
    const { value } = e.target;
    const selectedSchema = { ...rowSchemas.find((rowSchema) => rowSchema.id === value) };

    selectedSchema.schemaId = selectedSchema.id;
    selectedSchema.webPageId = pageId;
    selectedSchema.order = newRowOrder;
    selectedSchema.fields = selectedSchema.fields.map((field) => ({
      ...field,
      value: '',
    }));

    delete selectedSchema.id;

    setSelectedRowSchemaId(value);
    setSelectedRowSchema(selectedSchema);
  };

  return (
    <>
      {rowSchemas && (
        <>
          <Divider className={classes.divider} />
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
                Add New Row
              </Typography>
            </Grid>
            <Grid item>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="new-row-schema-label">Row Schema</InputLabel>
                <Select
                  labelId="new-row-schema-label"
                  id="new-row-schema"
                  value={selectedRowSchemaId}
                  onChange={handleSelectRowSchema}
                  label="Row Schema"
                  fullWidth
                >
                  {rowSchemas.map((schema) => (
                    <MenuItem value={schema.id} key={schema.id}>
                      {schema.meta.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

            {selectedRowSchema && (
              <form
                id="new-row"
                action={`${API_URL}/rows`}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                className={className}
                key="new-row"
              >
                <TextField
                  id="new-row-webPageId"
                  name="webPageId"
                  type="hidden"
                  value={pageId}
                />
                <TextField
                  id="new-row-schemaId"
                  name="order"
                  type="hidden"
                  value={selectedRowSchemaId}
                />
                <TextField
                  id="new-row-order"
                  name="order"
                  type="hidden"
                  value={newRowOrder}
                />
                  {selectedRowSchema.fields.map(({ name, type, value }) => (
                    <TextField
                      fullWidth
                      id={name}
                      label={name}
                      margin="normal"
                      name={name}
                      type={type}
                      variant="outlined"
                      value={value}
                      onChange={handleInputChange}
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
                    <ButtonGroup
                      variant="contained"
                      className={classes.buttonGroup}
                      size="small"
                      color="primary"
                      aria-label="contained primary button group"
                    >
                      <Button
                        type="submit"
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveAltIcon />}
                      >
                        Save Row
                      </Button>
                    </ButtonGroup>
                  </Grid>
                </Grid>
              </form>
            )}
        </>
      )}
    </>
  );
}

RowAddForm.defaultProps = {
  className: '',
};

RowAddForm.propTypes = {
  pageId: PropTypes.number.isRequired,
  className: PropTypes.string,
  newRowOrder: PropTypes.number.isRequired,
  getPageData: PropTypes.func,
};

export default RowAddForm;
