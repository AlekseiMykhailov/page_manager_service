import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStatusMessage } from 'src/hooks';

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
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import * as FETCH from 'src/utils/fetch';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const useStyles = makeStyles((theme) => ({
  root: {},
  heading: {
    textTransform: 'capitalize',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  fieldset: {
    position: 'relative',
    width: '100%',
    padding: theme.spacing(2),
    borderRadius: '4px',
    borderColor: theme.palette.common.black[100],
  },
  legend: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  divider: {
    height: '4px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  buttonGroup: {
    margin: '2rem 0',
  },
  fab: {
    alignSelf: 'flex-end',
  },
  hidden: {
    position: 'absolute',
  },
}));

function SectionAddForm({
  pageId, schemas, newSectionOrder, getPageData
}) {
  const [setStatusMessage] = useStatusMessage();
  const [selectedSectionSchemaName, setSelectedSectionSchemaName] = useState('');
  const [selectedSectionSchema, setSelectedSectionSchema] = useState();
  const [sectionData, setSectionData] = useState({
    schema: '',
    webPageId: pageId,
    order: newSectionOrder,
    fields: [],
    fieldsets: [],
  });

  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  console.log(sectionData);

  const handleSubmit = (e) => {
    e.preventDefault();

    FETCH.postData(
      `${API_URL}/sections`,
      selectedSectionSchema,
    ).then((response) => {
      if (response.ok) {
        setSelectedSectionSchemaName('');
        setSelectedSectionSchema('');
        getPageData();
      }

      setStatusMessage(response, null, 'Section was added');
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSelectedSectionSchema({
      ...selectedSectionSchema,
      fields: [...selectedSectionSchema.fields].map((field) => {
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

  const handleSelectSectionSchema = (e) => {
    const { value } = e.target;
    const selectedSchema = { ...schemas.find((sectionSchema) => sectionSchema.name === value) };

    setSelectedSectionSchemaName(value);
    setSelectedSectionSchema(selectedSchema);

    setSectionData({
      ...sectionData,
      schema: value,
      fields: selectedSchema.fields,
      fieldsets: selectedSchema.fieldsets.map((fieldset) => ({
        ...fieldset,
        itemFields: fieldset.itemFields.map((itemField) => ({
          ...itemField,
          name: itemField.name.replace('.', `[${fieldset.itemQty}].`)
        }))
      })),
    });
  };

  const addFieldSet = (fieldsetName) => {

  };

  const addField = () => {
    const clonableField = selectedSectionSchema.fields.find((field) => field.clonable);
    const sortedFields = selectedSectionSchema.fields.sort((a, b) => a.order - b.order);
    const lastOrder = sortedFields[sortedFields.length - 1].order;
    const newField = {
      ...clonableField,
      name: `${clonableField.name}-${lastOrder + 1}`,
      order: lastOrder + 1,
      value: '',
    };
    const updatedSectionSchema = {
      ...selectedSectionSchema,
      fields: [...selectedSectionSchema.fields, newField],
    };

    setSelectedSectionSchema(updatedSectionSchema);
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
            className={classes.heading}
          >
            {selectedSectionSchemaName
              ? `Add New ${(schemas.length > 0) && schemas.find((sectionSchema) => sectionSchema.name === selectedSectionSchemaName).title}`
              : 'Add New Section'}
          </Typography>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="new-section-schema-label">Section Type</InputLabel>
            <Select
              labelId="new-section-schema-label"
              id="new-section-schema"
              value={selectedSectionSchemaName}
              onChange={handleSelectSectionSchema}
              label="Section Type"
              fullWidth
            >
              {schemas.map((schema) => (
                <MenuItem value={schema.name} key={schema.name}>
                  {schema.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {selectedSectionSchema && (
      <form
        id="new-section"
        action={`${API_URL}/sections`}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        className={classes.form}
        key="new-section"
      >
        <div className={classes.hidden}>
          <TextField
            id="new-section-webPageId"
            name="webPageId"
            type="hidden"
            value={pageId}
          />
          <TextField
            id="new-section-name"
            name="order"
            type="hidden"
            value={selectedSectionSchemaName}
          />
          <TextField
            id="new-section-order"
            name="order"
            type="hidden"
            value={newSectionOrder}
          />
        </div>
        {selectedSectionSchema.fields.map(({
          name, description, type, value
        }) => (
          <TextField
            fullWidth
            id={name}
            label={description}
            margin="normal"
            name={name}
            type={type}
            variant="outlined"
            value={value}
            onChange={handleInputChange}
            key={name}
          />
        ))}

        {selectedSectionSchema.fields.some((field) => field.clonable) && (
          <Fab
            color="primary"
            aria-label="add"
            className={classes.fab}
            onClick={addField}
          >
            <AddIcon />
          </Fab>
        )}

        {selectedSectionSchema.fieldsets.map((fieldset) => (
          <Paper
            variant="outlined"
            className={classes.fieldset}
            key={fieldset.name}
          >
            <Typography variant="h5">
              {fieldset.title}
            </Typography>
            {fieldset.itemFields.map((itemField) => (
              <TextField
                fullWidth
                id={itemField.name}
                label={itemField.description}
                margin="normal"
                name={itemField.name}
                type={itemField.type}
                variant="outlined"
                value={itemField.value}
                onChange={handleInputChange}
                key={itemField.name}
              />
            ))}
            <Fab
              color="primary"
              aria-label="add fieldset"
              className={classes.fab}
              onClick={() => addFieldSet(fieldset.name)}
            >
              <AddIcon />
            </Fab>
          </Paper>
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
                Save Section
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
      )}
    </>
  );
}

SectionAddForm.propTypes = {
  pageId: PropTypes.number.isRequired,
  schemas: PropTypes.array.isRequired,
  newSectionOrder: PropTypes.number.isRequired,
  getPageData: PropTypes.func,
};

export default SectionAddForm;
