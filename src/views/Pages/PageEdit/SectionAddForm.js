import React, { useState, useMemo } from 'react';
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
    marginBottom: theme.spacing(2),
    borderRadius: '4px',
    borderColor: theme.palette.common.black[100],
  },
  fieldsetHeader: {
    alignSelf: 'flex-start',
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
  const [currentSchemaName, setCurrentSchemaName] = useState('');
  const [currentSchema, setCurrentSchema] = useState();
  const initialSectionData = useMemo(() => ({
    schema: '',
    webPageId: pageId,
    order: newSectionOrder,
    fields: [],
    fieldsets: [],
  }), [pageId, newSectionOrder]);
  const [sectionData, setSectionData] = useState(initialSectionData);

  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();

    FETCH.postData(
      `${API_URL}/sections`,
      sectionData,
    ).then((response) => {
      if (response.ok) {
        setCurrentSchemaName('');
        setCurrentSchema(null);
        setSectionData(initialSectionData);
        getPageData();
      }

      setStatusMessage(response, null, 'Section was added');
    });
  };

  const handleInputChange = (e, fieldsetName, fieldsBlockIndex) => {
    const { name, value } = e.target;

    if (fieldsetName) {
      setSectionData({
        ...sectionData,
        fieldsets: sectionData.fieldsets.map((fieldset) => {
          if (fieldset.name === fieldsetName) {
            return {
              ...fieldset,
              itemFields: fieldset.itemFields.map((itemFieldBlock, i) => {
                if (i === fieldsBlockIndex) {
                  return itemFieldBlock.map((itemField) => {
                    if (itemField.name === name) {
                      return {
                        ...itemField,
                        value,
                      };
                    }
                    return itemField;
                  });
                }
                return itemFieldBlock;
              })
            };
          }

          return fieldset;
        })
      });

      return;
    }

    setSectionData({
      ...sectionData,
      fields: [...sectionData.fields].map((field) => {
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
    const selectedSchema = { ...schemas.find((schema) => schema.name === value) };

    setCurrentSchemaName(value);
    setCurrentSchema(selectedSchema);

    setSectionData({
      ...sectionData,
      order: newSectionOrder,
      schema: value,
      fields: selectedSchema.fields,
      fieldsets: selectedSchema.fieldsets.map((fieldset) => ({
        ...fieldset,
        itemFields: [fieldset.itemFields.map((itemField) => ({
          ...itemField,
          name: itemField.name.replace('.', '[1].')
        }))],
      })),
    });
  };

  const addFieldsBlock = (name) => {
    const newItemFields = [
      ...currentSchema.fieldsets.find((fieldset) => fieldset.name === name).itemFields,
    ];

    setSectionData({
      ...sectionData,
      fieldsets: sectionData.fieldsets.map((fieldset) => {
        if (fieldset.name === name) {
          const itemsQty = fieldset.itemFields.length + 1;

          return {
            ...fieldset,
            itemFields: [
              ...fieldset.itemFields,
              newItemFields.map((field) => ({
                ...field,
                name: field.name.replace('.', `[${itemsQty}].`),
              })),
            ],
            itemsQty,
          };
        }

        return fieldset;
      })
    });
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
            {currentSchema
              ? `Add New ${schemas.find((schema) => (schema.name === currentSchema.name)).title}`
              : 'Add New Section'}
          </Typography>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="new-section-schema-label">Section Type</InputLabel>
            <Select
              labelId="new-section-schema-label"
              id="new-section-schema"
              value={currentSchemaName}
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

      {currentSchema && (
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
            value={currentSchema.name}
          />
          <TextField
            id="new-section-order"
            name="order"
            type="hidden"
            value={newSectionOrder}
          />
        </div>
        {sectionData.fields.map(({
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

        {sectionData.fieldsets.map((fieldset) => (
          <React.Fragment key={fieldset.name}>
            <Typography variant="h4" className={classes.fieldsetHeader}>
              {fieldset.title}
            </Typography>
            {fieldset.itemFields.map((itemFieldBlock, i) => (
              <Paper
                variant="outlined"
                className={classes.fieldset}
                key={i}
              >
                {itemFieldBlock.map(({
                  name, type, description, value
                }) => {
                  if (type === 'select') {
                    return (
                      <FormControl variant="outlined" className={classes.formControl} fullWidth key={name}>
                        <InputLabel id={name}>{description}</InputLabel>
                        <Select
                          labelId={name}
                          id={name}
                          name={name}
                          value={value}
                          onChange={(e) => handleInputChange(e, fieldset.name, i)}
                          label={description}
                          fullWidth
                        >
                          {fieldset.options && fieldset.options.map((option) => (
                            <MenuItem value={option.id} key={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  }

                  return (
                    <TextField
                      fullWidth
                      id={name}
                      label={description}
                      margin="normal"
                      name={name}
                      type={type}
                      variant="outlined"
                      value={value}
                      onChange={(e) => handleInputChange(e, fieldset.name, i)}
                      key={name}
                    />
                  );
                })}
              </Paper>
            ))}
            {(fieldset.itemFields.length < fieldset.maxItemsQty) && (
              <Fab
                color="primary"
                aria-label="add fieldset"
                className={classes.fab}
                onClick={() => addFieldsBlock(fieldset.name)}
              >
                <AddIcon />
              </Fab>
            )}
          </React.Fragment>
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
