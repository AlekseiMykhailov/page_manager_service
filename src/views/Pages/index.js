import React, {
  useState, useEffect, useCallback, useMemo
} from 'react';
import { useParams } from 'react-router-dom';
import * as CONST from 'src/utils/const';
import * as FETCH from 'src/utils/fetch';
import { useDebounce, useStatusMessage } from 'src/hooks';

import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import {
  Container,
} from '@material-ui/core';
import PageHeader from 'src/components/PageHeader';
import PagesControls from 'src/views/Pages/PagesControls';
import PagesList from 'src/views/Pages/PagesList';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
}));

function Pages() {
  const classes = useStyles();
  const [setStatusMessage] = useStatusMessage();
  const API_URL = process.env.REACT_APP_API_URL;
  const { domainId } = useParams();
  const [actualDomainData, setActualDomainData] = useState();
  const [pages, setPages] = useState([]);
  const [pagesOrder, setPagesOrder] = useState(CONST.sortTypes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const sortedPages = useMemo(() => {
    const sort = {
      newest: () => ([...pages].sort((a, b) => (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))),
      oldest: () => ([...pages].sort((a, b) => (
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()))),
      az: () => ([...pages].sort((a, b) => a.title.localeCompare(b.title))),
      za: () => ([...pages].sort((a, b) => b.title.localeCompare(a.title))),
    };
    return (sort[pagesOrder.type]() || pages);
  }, [pages, pagesOrder.type]);

  const filteredPages = useMemo(() => {
    if (sortedPages.length > 0 && domainId) {
      return sortedPages.filter((page) => page.domainId === +domainId);
    }
    return sortedPages;
  }, [sortedPages, domainId]);

  const searchedPages = useMemo(() => {
    if (debouncedSearchQuery === '') {
      return filteredPages;
    }

    return filteredPages.filter((page) => {
      const inSlug = page.slug.includes(debouncedSearchQuery);
      const inTitle = page.title.toLowerCase().includes(debouncedSearchQuery);
      const inDescription = page.description.toLowerCase().includes(debouncedSearchQuery);

      return (inSlug || inTitle || inDescription);
    });
  }, [filteredPages, debouncedSearchQuery]);

  const fetchPages = useCallback(() => {
    FETCH.getData(`${API_URL}/pages`)
      .then((response) => {
        setPages(response.pages);
      });
  }, [API_URL]);

  const fetchDomains = useCallback(() => {
    FETCH.getData(`${API_URL}/domains`)
      .then((domains) => {
        if (domains) {
          setActualDomainData(domains.find((domain) => domain.id === +domainId));
        }
      });
  }, [API_URL, domainId]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const deleteWepPage = (e) => {
    const { pageId } = e.currentTarget.dataset;

    FETCH.deleteData(`${API_URL}/pages/${pageId}`)
      .then((response) => setStatusMessage(response, fetchPages, 'Page was deleted', response.err));
  };

  const handleSortType = (e) => {
    const { value } = e.target;
    const selectedSortType = CONST.sortTypes.find((sortType) => sortType.type === value);

    setPagesOrder(selectedSortType);
  };

  const handleSearchQuery = (e) => {
    const { value } = e.target;

    setSearchQuery(value.toLowerCase() || '');
  };

  return (
    <Page
      className={classes.root}
      title="Pages"
    >
      <Container maxWidth="lg">
        {actualDomainData && (
          <PageHeader
            name="pages"
            title={actualDomainData.name}
            subtitle={actualDomainData.domain}
          />
        )}
        {filteredPages && (
          <PagesControls
            sortTypes={CONST.sortTypes}
            pagesOrder={pagesOrder}
            handleSortType={handleSortType}
            handleSearchQuery={handleSearchQuery}
          />
        )}
        {searchedPages.length > 0 && (
          <PagesList
            className={classes.pages}
            pages={searchedPages}
            deleteWepPage={deleteWepPage}
          />
        )}
      </Container>
    </Page>
  );
}

export default Pages;
