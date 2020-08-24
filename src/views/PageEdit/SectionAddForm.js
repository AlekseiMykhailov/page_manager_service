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
  const [selectedSectionSchemaId, setSelectedSectionSchemaId] = useState('');
  const [selectedSectionSchema, setSelectedSectionSchema] = useState();
  const [setStatusMessage] = useStatusMessage();

  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();

    FETCH.postData(
      `${API_URL}/sections`,
      selectedSectionSchema,
    ).then((response) => {
      if (response.ok) {
        setSelectedSectionSchemaId('');
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
    const selectedSchema = { ...schemas.find((sectionSchema) => sectionSchema.id === value) };

    selectedSchema.schemaId = selectedSchema.id;
    selectedSchema.webPageId = pageId;
    selectedSchema.order = newSectionOrder;
    selectedSchema.fields = selectedSchema.fields.map((field) => ({
      ...field,
      value: '',
    }));

    delete selectedSchema.id;

    setSelectedSectionSchemaId(value);
    setSelectedSectionSchema(selectedSchema);
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
            {selectedSectionSchemaId
              ? `Add New ${(schemas.length > 0) && schemas.find((sectionSchema) => sectionSchema.id === selectedSectionSchemaId).meta.title}`
              : 'Add New Section'}
          </Typography>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="new-section-schema-label">Section Type</InputLabel>
            <Select
              labelId="new-section-schema-label"
              id="new-section-schema"
              value={selectedSectionSchemaId}
              onChange={handleSelectSectionSchema}
              label="Section Schema"
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
            id="new-section-schemaId"
            name="order"
            type="hidden"
            value={selectedSectionSchemaId}
          />
          <TextField
            id="new-section-order"
            name="order"
            type="hidden"
            value={newSectionOrder}
          />
        </div>
        {selectedSectionSchema.fields.map(({ name, label, type, value }) => (
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
