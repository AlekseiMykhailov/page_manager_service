import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  ButtonGroup,
  Button,
  Divider,
  InputLabel,
  Fab,
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
import AddIcon from '@material-ui/icons/Add';
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
  fab: {
    alignSelf: 'flex-end',
  },
}));

function RowAddForm({
  pageId, className, schemas, newRowOrder, getPageData
}) {
  const [selectedRowSchemaId, setSelectedRowSchemaId] = useState('');
  const [selectedRowSchema, setSelectedRowSchema] = useState();

  const dispatch = useDispatch();
  const { slug } = useParams();
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

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
    const selectedSchema = { ...schemas.find((rowSchema) => rowSchema.id === value) };

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

  const addField = () => {
    const clonableField = selectedRowSchema.fields.find((field) => field.clonable);
    const sortedFields = selectedRowSchema.fields.sort((a, b) => a.order - b.order);
    const lastOrder = sortedFields[sortedFields.length - 1].order;
    const newField = {
      ...clonableField,
      name: `${clonableField.name}-${lastOrder + 1}`,
      order: lastOrder + 1,
      value: '',
    };
    const updatedRowSchema = {
      ...selectedRowSchema,
      fields: [...selectedRowSchema.fields, newField],
    };

    setSelectedRowSchema(updatedRowSchema);
  };

  return (
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
            {selectedRowSchemaId
              ? `Add New ${(schemas.length > 0) && schemas.find((rowSchema) => rowSchema.id === selectedRowSchemaId).meta.title}`
              : 'Add New Row'}
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
              {schemas.map((schema) => (
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
        {selectedRowSchema.fields.map(({ name, label, type, value }) => (
          <TextField
            fullWidth
            id={name}
            label={label}
            margin="normal"
            name={name}
            type={type}
            variant="outlined"
            value={value}
            onChange={handleInputChange}
            key={name}
          />
        ))}
        {selectedRowSchema.fields.some((field) => field.clonable) && (
          <Fab
            color="primary"
            aria-label="add"
            className={classes.fab}
            onClick={addField}
          >
            <AddIcon />
          </Fab>
        )}
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
  );
}

RowAddForm.defaultProps = {
  className: '',
};

RowAddForm.propTypes = {
  pageId: PropTypes.number.isRequired,
  className: PropTypes.string,
  schemas: PropTypes.array.isRequired,
  newRowOrder: PropTypes.number.isRequired,
  getPageData: PropTypes.func,
};

export default RowAddForm;
