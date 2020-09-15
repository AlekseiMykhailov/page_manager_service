import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as FETCH from 'src/utils/fetch';

function PagePreview() {
  const [preview, setPreview] = useState();
  const API_URL = process.env.REACT_APP_API_URL;
  const { slug } = useParams();

  useEffect(() => {
    FETCH.getData(
      `${API_URL}/preview/${slug}`
    ).then((response) => {
      setPreview(response.html);
    });
  }, [API_URL, slug]);

  const getHTML = useMemo(() => {
    if (preview) {
      return {
        __html: preview,
      };
    }
    return {
      __html: '',
    };
  }, [preview]);

  return (
    <div dangerouslySetInnerHTML={getHTML} />
  );
}

export default PagePreview;
