import React, { useState, useCallback, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as FETCH from 'src/utils/fetch';
import { useStatusMessage } from 'src/hooks';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {},
  wrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  buttons: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  button: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    color: theme.palette.common.white,
  },
  cloneButton: {
    minWidth: '200px',
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    minWidth: '160px',
    marginLeft: theme.spacing(1),
  },
  select: {
    '& > div': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  },
}));

function PageClone({ className }) {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const { domainId, webPageId } = useParams();
  const [setStatusMessage] = useStatusMessage();
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [redirectData, setRedirectData] = useState(null);
  const [isCloning, setIsCloning] = useState(false);

  const getDomains = useCallback(() => {
    FETCH.getData(`${API_URL}/domains`)
      .then((response) => {
        if (response.ok) {
          setSelectedDomain(response.domains.find((domain) => domain.id === +domainId));
          setDomains(response.domains);
        }
      });
  }, [API_URL, domainId]);

  useEffect(() => {
    getDomains();
  }, [getDomains]);

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setSelectedDomain(domains.find((domain) => domain.id === +value));
  };

  const handleClone = () => {
    const cloneData = {
      webPageId,
      domainId: selectedDomain.id,
      domain: selectedDomain.domain,
    };

    setIsCloning(true);

    FETCH.postData(`${API_URL}/pages/clone`, cloneData)
      .then((response) => {
        if (response.ok) {
          setRedirectData({
            ...cloneData,
            webPageId: response.id,
          });
        }
        setStatusMessage(response, null, 'Page was cloned');
        setIsCloning(false);
      });
  };

  return (
    <div className={clsx(classes.root, className)}>
      {redirectData && (<Redirect to={`/pages/${redirectData.domainId}/${redirectData.webPageId}`} />)}
      {domains.length > 0 && (
        <>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={clsx(classes.button, classes.cloneButton)}
              onClick={handleClone}
              startIcon={<FileCopy />}
              disabled={isCloning}
            >
              Clone Page To
            </Button>
            {isCloning && <CircularProgress color="primary" size={24} className={classes.progress} />}
          </div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="domain-for-page-clone-label">Domain</InputLabel>
            <Select
              labelId="domain-for-page-clone-label"
              id="domain-for-page-clone"
              value={selectedDomain.id}
              onChange={handleSelectChange}
              label="Domain"
              className={classes.select}
            >
              {domains.map((domain) => (
                <MenuItem value={domain.id} key={domain.id}>
                  {domain.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </div>
  );
}

PageClone.propTypes = {
  className: PropTypes.string,
};

export default PageClone;
