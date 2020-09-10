import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStatusMessage } from 'src/hooks';
import * as FETCH from 'src/utils/fetch';
import {
  ButtonGroup,
  Button,
  Divider,
  Fab,
  FormControl,
  MenuItem,
  InputLabel,
  Grid,
  Paper,
  Select,
  TextField,
  Typography,
  colors,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddIcon from '@material-ui/icons/Add';
import FieldsetControl from './FieldsetControl';

const useStyles = makeStyles((theme) => ({
  root: {},
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
    borderColor: theme.palette.common.black[300],
  },
  fieldsetHeader: {
    alignSelf: 'flex-start',
  },
  divider: {
    height: '4px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  deleteButton: {
    color: colors.red[600],
    borderColor: colors.red[600],
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: colors.red[600]
    }
  },
  fab: {
    alignSelf: 'flex-end',
  },
}));

function SectionEditForm({
  sectionData,
  index,
  maxIndex,
  handleChangeOrder,
  getPageData,
  savePageData,
}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const classes = useStyles();
  const { id } = sectionData;
  const [setStatusMessage] = useStatusMessage();
  const [section, setSection] = useState();
  const [deletingFieldIds, setDeletingFieldIds] = useState();

  useEffect(() => {
    setSection({
      fields: [...sectionData.fields],
      fieldsets: [...sectionData.fieldsets],
    });
  }, [sectionData.fields, sectionData.fieldsets]);

  const handleAddFieldsBlock = (e) => {
    const { fieldsetName } = e.currentTarget.dataset;
    const currentFieldset = section.fieldsets.find((fieldset) => (
      fieldset.name === fieldsetName
    ));
    const fieldsBlockQty = currentFieldset.fieldsBlocks.length;
    const newFieldsBlock = currentFieldset.itemFields.map((itemField) => ({
      ...itemField,
      name: itemField.name.replace('.', `[${fieldsBlockQty + 1}].`)
    }));

    setSection({
      ...section,
      fieldsets: section.fieldsets.map((fieldset) => {
        if (fieldset.name === fieldsetName) {
          return {
            ...fieldset,
            fieldsBlocks: [...fieldset.fieldsBlocks, newFieldsBlock],
          };
        }
        return fieldset;
      }),
    });
  };

  const handleChange = (e, fieldsetName, fieldsBlockIndex) => {
    const { name, value } = e.target;

    if (fieldsetName) {
      setSection({
        ...section,
        fieldsets: section.fieldsets.map((fieldset) => {
          if (fieldset.name === fieldsetName) {
            return {
              ...fieldset,
              fieldsBlocks: fieldset.fieldsBlocks.map((fieldsBlock, i) => {
                if (i === +fieldsBlockIndex) {
                  return fieldsBlock.map((field) => {
                    if (field.name === name) {
                      return {
                        ...field,
                        value,
                      };
                    }
                    return field;
                  });
                }
                return fieldsBlock;
              })
            };
          }
          return fieldset;
        })
      });

      return;
    }

    setSection({
      ...section,
      fields: section.fields.map((field) => {
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

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    const fields = [...section.fields];
    section.fieldsets.forEach((fieldset) => {
      fieldset.fieldsBlocks.forEach((fieldsBlock) => {
        fields.push(...fieldsBlock);
      });
    });

    FETCH.putData(`${API_URL}/sections/${id}`, { fields, deletingFieldIds })
      .then((response) => {
        setStatusMessage(response, getPageData, 'Section was edited');

        if (response.ok) {
          savePageData();
        }
      });
  };

  const handleDeleteSection = () => {
    FETCH.deleteData(`${API_URL}/sections/${id}`)
      .then((response) => {
        setStatusMessage(response, getPageData, 'Section was deleted');

        if (response.ok) {
          savePageData();
        }
      });
  };

  const handleDeleteFieldsBlock = (fieldsetName, blockIndex) => {
    const currentFieldset = section.fieldsets.find((fieldset) => (
      fieldset.name === fieldsetName
    ));

    const fieldIdsForDelete = currentFieldset.fieldsBlocks[blockIndex].map((field) => field.id);
    setDeletingFieldIds(fieldIdsForDelete);

    setSection({
      ...section,
      fieldsets: section.fieldsets.map((fieldset) => {
        if (fieldset.name === fieldsetName) {
          return {
            ...fieldset,
            fieldsBlocks: fieldset.fieldsBlocks
              .filter((fieldsBlock, i) => i !== blockIndex)
              .map((fieldsBlock, indexFieldsBlock) => fieldsBlock.map((field) => ({
                ...field,
                name: field.name.replace(/\d/g, `${indexFieldsBlock + 1}`)
              }))),
          };
        }
        return fieldset;
      })
    });
  };

  const handleChangeOrderFieldsBlock = (fieldsetName, blockIndex, direction) => {
    const currentFieldset = section.fieldsets.find((fieldset) => fieldset.name === fieldsetName);
    const fieldsBlocksQty = currentFieldset.fieldsBlocks.length;

    if (fieldsBlocksQty <= 1) {
      return;
    }

    const fieldsBlockA = [...currentFieldset.fieldsBlocks[blockIndex]];
    let fieldsBlockB;

    if (direction === 'up' && blockIndex > 0) {
      fieldsBlockB = [...currentFieldset.fieldsBlocks[blockIndex - 1]];
    }
    if (direction === 'down' && blockIndex < fieldsBlocksQty - 1) {
      fieldsBlockB = [...currentFieldset.fieldsBlocks[blockIndex + 1]];
    }

    if (fieldsBlockA && fieldsBlockB) {
      setSection({
        ...section,
        fieldsets: section.fieldsets.map((fieldset) => {
          if (fieldset) {
            return {
              ...fieldset,
              fieldsBlocks: fieldset.fieldsBlocks.map((fieldBlock, i) => {
                if (i === blockIndex) {
                  return fieldBlock.map((field, i) => ({
                    ...field,
                    value: fieldsBlockB[i].value,
                  }));
                }
                if ((i === blockIndex - 1 && direction === 'up') || (i === blockIndex + 1 && direction === 'down')) {
                  return fieldBlock.map((field, i) => ({
                    ...field,
                    value: fieldsBlockA[i].value,
                  }));
                }
                return fieldBlock;
              })
            };
          }
          return fieldset;
        })
      });
    }
  };

  if (!section) {
    return null;
  }

  return (
    <>
      <Divider className={classes.divider} />
      <form
        id={id}
        action={`${API_URL}/sections/${id}`}
        data-section-id={id}
        noValidate
        autoComplete="off"
        className={classes.form}
        onSubmit={handleSubmit}
      >
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
              {sectionData.title}
            </Typography>
          </Grid>
          <Grid item>
            {(maxIndex > 0) && (
            <div className={classes.root}>
              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button
                  data-section-id={id}
                  data-direction="up"
                  disabled={index === 0}
                  onClick={handleChangeOrder}
                >
                  <ArrowUpwardIcon />
                </Button>
                <Button
                  data-section-id={id}
                  data-direction="down"
                  disabled={index === maxIndex}
                  onClick={handleChangeOrder}
                >
                  <ArrowDownwardIcon />
                </Button>
              </ButtonGroup>
            </div>
            )}
          </Grid>
        </Grid>
        {section.fields.sort((a, b) => a.order - b.order).map(({
          name, type, description, value
        }) => (
          <TextField
            fullWidth
            id={`${id}-${name}`}
            inputProps={{ 'data-section-id': id }}
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

        {section.fieldsets.map((fieldset) => (
          <React.Fragment key={fieldset.name}>
            <Typography variant="h4" className={classes.fieldsetHeader}>
              {fieldset.title}
            </Typography>
            {fieldset.fieldsBlocks.map((fieldsBlock, i) => {
              if (fieldsBlock) {
                return (
                  <Paper
                    variant="outlined"
                    className={classes.fieldset}
                    key={i}
                  >
                    <FieldsetControl
                      fieldsetName={fieldset.name}
                      fieldsetBlockIndex={i}
                      handleDeleteFieldsBlock={handleDeleteFieldsBlock}
                      handleChangeOrderFieldsBlock={handleChangeOrderFieldsBlock}
                      savePageData={savePageData}
                    />
                    {fieldsBlock.sort((a, b) => a.order - b.order).map(({
                      name, type, description, value
                    }) => {
                      if (type === 'select') {
                        return (
                          <FormControl 
                            variant="outlined" 
                            className={classes.formControl} 
                            fullWidth
                            key={name}
                          >
                            <InputLabel id={name}>{description}</InputLabel>
                            <Select
                              labelId={name}
                              id={name}
                              name={name}
                              value={value}
                              onChange={(e) => handleChange(e, fieldset.name, i)}
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
                          id={`${id}-${name}`}
                          label={description}
                          margin="normal"
                          name={name}
                          type={type}
                          variant="outlined"
                          value={value}
                          onChange={(e) => handleChange(e, fieldset.name, i)}
                          key={name}
                        />
                      );
                    })}
                  </Paper>
                );
              }
              return null;
            })}
            {fieldset.fieldsBlocks.length < fieldset.maxItemsQty && (
              <Fab
                data-fieldset-name={fieldset.name}
                color="primary"
                aria-label="add"
                className={classes.fab}
                onClick={handleAddFieldsBlock}
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
          <ButtonGroup
            className={classes.buttonGroup}
            size="small"
            aria-label="contained primary button group"
          >
            <Button
              variant="outlined"
              className={classes.deleteButton}
              data-section-id={id}
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSection}
            >
              Delete Section
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveAltIcon />}
              color="primary"
            >
              Save Section
            </Button>
          </ButtonGroup>
        </Grid>
      </form>
    </>
  );
}

SectionEditForm.propTypes = {
  sectionData: PropTypes.object,
  index: PropTypes.number.isRequired,
  maxIndex: PropTypes.number.isRequired,
  getPageData: PropTypes.func.isRequired,
  savePageData: PropTypes.func.isRequired,
  handleChangeOrder: PropTypes.func.isRequired,
};

export default SectionEditForm;
