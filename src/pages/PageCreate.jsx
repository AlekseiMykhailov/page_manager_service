import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button } from '../components/Button';
import { Form, Input } from '../components/Form';
import { Spinner } from '../components/Spinner';
import * as API from '../helpers/api';
import * as CONST from '../helpers/const';
import { Layout } from '../layouts';
import { setStatusMessage, removeStatusMessage } from '../actions/messageActions';

export const PageCreate = () => {
  const [pageSchema, setPagesSchema] = useState(null);
  const [pageData, setPagesData] = useState(null);
  const [isCreated, setIsCreated] = useState(false);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;

  const getPageSchema = useCallback(() => {
    API.getData(`${API_URL}/pages/schema`)
      .then(res => {
        if (res.ok) {
          const newPageData = {};

          Object.values(res.schema).map(({ name }) => newPageData[name] = '');

          setPagesSchema(res.schema);
          setPagesData(newPageData);

        } else if (res.error) {
          console.log(res.error);
        }
      });
  }, [API_URL]);

  useEffect(() => {
    getPageSchema();
  }, [getPageSchema]);

  const handleStatusMessage = (status, text) => {
    dispatch(setStatusMessage(status, text));

    setTimeout(() => {
      dispatch(removeStatusMessage());
    }, CONST.TIME_VISIBILITY_MESSAGES);
  };

  const createWebPage = (e) => {
    e.preventDefault();

    API.postData(
      e.target.action,
      pageData,
    ).then(res => {
      if (res.ok) {
        console.log(res);
        setIsCreated(true);
        handleStatusMessage(CONST.SUCCESS, 'New page was created');
      } else {
        console.log(`Error: ${res}`);
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value} = e.target;

    setPagesData({
      ...pageData,
      [name]: value,
    });
  };

  return (
    <Layout title="Create New Page">
      <>
        {isCreated && <Redirect to={`/pages/${pageData.slug}`} />}
        <h1>Create New Web Page</h1>
        {!pageSchema && pageData && <Spinner />}
        {pageSchema && pageData && (
          <Form
            id="web-page-data-form"
            action={`${API_URL}/pages`}
            handleSubmit={createWebPage}
          >
            {Object.values(pageSchema).map(({ name, type }) => (
              <Input
                id={name}
                name={name}
                type={type}
                value={pageData[name]}
                label={name}
                handleChange={handleInputChange}
                key={name}
              />
            ))}
            <div className="Form__BlockButtons">
              <Button buttonType="submit">Add Page</Button>
            </div>
          </Form>
        )}
      </>
    </Layout>
  );
};
