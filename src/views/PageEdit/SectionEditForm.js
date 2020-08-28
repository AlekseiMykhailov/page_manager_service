import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStatusMessage } from 'src/hooks';
import * as FETCH from 'src/utils/fetch';
import {
  ButtonGroup,
  Button,
  Divider,
  Fab,
  Grid,
  Paper,
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
  const [sectionSchema, setSectionSchema] = useState({
    fields: sectionData.fields,
    fieldsets: sectionData.fieldsets,
  });
  const [sectionFieldsMap, setSectionFieldsMap] = useState(sectionData.fieldsMap);

  const handleAddFieldsBlock = (e) => {
    const { fieldsetName } = e.currentTarget.dataset;
    const currentFieldset = sectionSchema.fieldsets.find((fieldset) => (
      fieldset.name === fieldsetName
    ));
    const fieldsBlockQty = currentFieldset.fieldsBlocks.length;
    const newFieldsBlock = currentFieldset.itemFields.map((itemField) => ({
      ...itemField,
      name: itemField.name.replace('.', `[${fieldsBlockQty + 1}].`)
    }));

    setSectionFieldsMap({
      ...sectionFieldsMap,
      ...newFieldsBlock.reduce((acc, field) => {
        acc[field.name] = field;
        return acc;
      }, {}),
    });
    setSectionSchema({
      ...sectionSchema,
      fieldsets: sectionSchema.fieldsets.map((fieldset) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSectionFieldsMap({
      ...sectionFieldsMap,
      [name]: {
        ...sectionFieldsMap[name],
        value,
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    FETCH.putData(`${API_URL}/sections/${id}`, { fields: Object.values(sectionFieldsMap) })
      .then((response) => {
        setStatusMessage(response, getPageData, 'Section was edited');

        if (response.ok) {
          savePageData();
        }
      });
  };

  const handleDelete = () => {
    FETCH.deleteData(`${API_URL}/sections/${id}`)
      .then((response) => {
        setStatusMessage(response, getPageData, 'Section was deleted');

        if (response.ok) {
          savePageData();
        }
      });
  };

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
        {sectionSchema.fields.map(({
          name, type, description
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
            value={sectionFieldsMap[name].value}
            onChange={handleChange}
            key={name}
          />
        ))}

        {sectionSchema.fieldsets.map((fieldset) => (
          <React.Fragment key={fieldset.name}>
            <Typography variant="h4" className={classes.fieldsetHeader}>
              {fieldset.title}
            </Typography>
            {fieldset.fieldsBlocks.map((fieldsBlock) => {
              if (fieldsBlock) {
                return (
                  <Paper
                    variant="outlined"
                    className={classes.fieldset}
                    key={JSON.stringify(fieldsBlock)}
                  >
                    {fieldsBlock.map(({
                      name, type, description
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
                        value={sectionFieldsMap[name].value}
                        onChange={handleChange}
                        key={name}
                      />
                    ))}
                  </Paper>
                );
              }
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
              onClick={handleDelete}
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
