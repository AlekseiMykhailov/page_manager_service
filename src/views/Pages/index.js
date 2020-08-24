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
import PagesControls from '../../components/WebPage/PagesControls';
import PagesList from '../../components/WebPage/PagesList';

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
  const [actualDomain, setActualDomain] = useState();
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
    if (sortedPages.length > 0 && actualDomain) {
      return sortedPages.filter((page) => page.domain === actualDomain.domain);
    }
    return sortedPages;
  }, [sortedPages, actualDomain]);

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
    let pageList = [];

    FETCH.getData(`${API_URL}/pages`)
      .then((response) => { pageList = response.pages; })
      .then(() => FETCH.getData(`${API_URL}/publish`))
      .then((published) => {
        const pagesWithPublishData = pageList.map((page) => {
          const publishedPageData = published.pages.find((publishedPage) => (
            publishedPage.webPageId === page.id
          ));

          if (publishedPageData) {
            return {
              ...page,
              publishedAt: publishedPageData.updatedAt,
            };
          }

          return page;
        });

        setPages(pagesWithPublishData);
      });
  }, [API_URL]);

  const fetchDomains = useCallback(() => {
    FETCH.getData(`${API_URL}/domains`)
      .then((response) => {
        if (response.ok) {
          setActualDomain(response.domains.find((domain) => domain.id === +domainId));
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
        {actualDomain && (
          <PageHeader
            name="pages"
            title={actualDomain.name}
            subtitle={actualDomain.domain}
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
            domain={actualDomain}
            deleteWepPage={deleteWepPage}
          />
        )}
      </Container>
    </Page>
  );
}

export default Pages;
