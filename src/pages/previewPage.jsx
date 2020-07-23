import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '../helpers';
import { Spinner } from '../components/Spinner';

export const PreviewPage = () => {
  const [pageHTML, setPageHTML] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const { slug } = useParams();

  useEffect(() => {
    getData(`${API_URL}/preview/${slug}`).then(res => {
      console.log(res);
      setPageHTML(res.html);

      return res.html;
    });
  }, [API_URL, slug]);

  return (

    <>
      {!pageHTML && <Spinner />}
      {pageHTML && (
        <>
          {JSON.html(pageHTML)}
        </>
      )}
    </>
  );
};
