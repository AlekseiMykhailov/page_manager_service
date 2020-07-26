import React from 'react';
import PropTypes from 'prop-types';
// import { Button } from '../components/Button';
import { Form, Input } from '../components/Form';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

export const RowEditContainer = ({
  row,
  index,
  maxIndex,
  handleSubmit,
  handleInputChange,
  handleChangeOrder,
  handleDelete,
}) => {
  const { id, fields, meta } = row;
  const API_URL = process.env.REACT_APP_API_URL;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

  const classes = useStyles();

  return (
    <Form
      id={id}
      action={`${API_URL}/rows/${id}`}
      data-row-id={id}
      noValidate
      autoComplete="off"
      handleSubmit={handleSubmit}
    >
      <div className="Form__Header">
        <h2>{meta.title}</h2>
        {maxIndex && (
        // <div className="Form__OrderButtons">
        //   <Button
        //     type="button"
        //     data-row-id={id}
        //     data-direction="up"
        //     disabled={index === 0}
        //     className="Button--round"
        //     handleClick={handleChangeOrder}
        //   >&uarr;</Button>
        //   <Button
        //     type="button"
        //     data-row-id={id}
        //     data-direction="down"
        //     disabled={index === maxIndex}
        //     className="Button--round"
        //     handleClick={handleChangeOrder}
        //   >&darr;</Button>
        // </div>


          <div className={classes.root}>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button
                data-row-id={id}
                data-direction="up"
                disabled={index === 0}
                onClick={handleChangeOrder}
              >
                &uarr;
              </Button>
              <Button
                data-row-id={id}
                data-direction="down"
                disabled={index === maxIndex}
                onClick={handleChangeOrder}
              >
                &darr;
              </Button>
            </ButtonGroup>
          </div>
        )}
      </div>
      {fields && fields.map(({name, type,value }) => (
        <Input
          id={`${id}-${name}`}
          data-row-id={id}
          name={name}
          type={type}
          value={value}
          label={name}
          handleChange={handleInputChange}
          key={name}
        />
      ))}
      {/*
      <div className="Form__BlockButtons">
        <Button type="submit">Save row</Button>
        <Button
          type="submit"
          className="Button--danger"
          data-row-id={id}
          onClick={handleDelete}
        >
          Delete row
        </Button>
      </div>
      */}
      <div className={classes.root}>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Save Row
          </Button>
          <Button
            variant="contained"
            color="secondary"
            data-row-id={id}
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete Row
          </Button>
        </ButtonGroup>
      </div>
    </Form>
  );
};

RowEditContainer.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    meta: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired,
  }),
  index: PropTypes.number.isRequired,
  maxIndex: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleChangeOrder: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
