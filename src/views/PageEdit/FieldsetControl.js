import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

function FieldsetControl({
  className,
  fieldsetName,
  fieldsetBlockIndex,
  handleDeleteFieldsBlock,
  handleChangeOrderFieldsBlock,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleDeleteFieldsBlock(fieldsetName, fieldsetBlockIndex);
    handleClose();
  };

  const handleChangeOrder = (e) => {
    const { direction } = e.currentTarget.dataset;

    handleChangeOrderFieldsBlock(fieldsetName, fieldsetBlockIndex, direction);
    handleClose();
  };

  return (
    <div className={clsx(classes.root, className)}>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        ...
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDelete}>
          Delete Block
        </MenuItem>
        <MenuItem
          data-direction="up"
          onClick={handleChangeOrder}
        >
          Lift Block Up
        </MenuItem>
        <MenuItem
          data-direction="down"
          onClick={handleChangeOrder}
        >
          Put Block Down
        </MenuItem>
      </Menu>
    </div>
  );
}

FieldsetControl.propTypes = {
  className: PropTypes.string,
  fieldsetName: PropTypes.string,
  fieldsetBlockIndex: PropTypes.number,
  handleDeleteFieldsBlock: PropTypes.func,
  handleChangeOrderFieldsBlock: PropTypes.func,
};

export default FieldsetControl;
