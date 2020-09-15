import React, {
  useState, useCallback, useEffect, useMemo
} from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useStatusMessage } from 'src/hooks';
import {
  Card,
  CardContent,
  Container,
  Divider,
  colors,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import * as FETCH from 'src/utils/fetch';
import FormPageEdit from 'src/views/Pages/PageEdit/FormPageEdit';
import PageEditHeader from './PageEditHeader';
import PageEditButtons from './PageEditButtons';
import PageRedirectControl from './PageRedirectControl';
import SectionEditForm from './SectionEditForm';
import SectionAddForm from './SectionAddForm';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  divider: {
    backgroundColor: colors.grey[300],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

function PageEdit() {
  const classes = useStyles();
  const { domainId, webPageId } = useParams();
  const [setStatusMessage] = useStatusMessage();

  const [pageData, setPageData] = useState(null);
  const [redirectsData, setRedirectsData] = useState([]);
  const [sectionsData, setSectionsData] = useState([]);
  const [sectionsSchemas, setSectionsSchemas] = useState([]);

  const [isDeleted, setIsDeleted] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const getPageData = useCallback(() => {
    FETCH.getData(`${API_URL}/pages/${webPageId}`)
      .then((response) => {
        if (response.ok) {
          const {
            id,
            title,
            domain,
            slug,
            isHomePage,
            publishedAt,
            redirects,
            webPageFields,
            sections,
          } = response.data;
          setPageData({
            id,
            title,
            domain,
            slug,
            isHomePage,
            publishedAt,
            fields: webPageFields,
          });
          setRedirectsData(redirects);
          setSectionsData(sections);
        }
      });
  }, [API_URL, webPageId]);

  const getSectionsSchemas = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/sections`)
      .then((response) => {
        if (response.ok) {
          setSectionsSchemas(response.schemas);
        }
      });
  }, [API_URL]);

  useEffect(() => {
    getPageData();
    getSectionsSchemas();
  }, [getPageData, getSectionsSchemas]);

  const handlePageDataInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setPageData({
        ...pageData,
        fields: pageData.fields.map((field) => {
          if (field.name === name) {
            return {
              ...field,
              value: !field.value,
            };
          }
          return field;
        }),
      });
      return;
    }

    setPageData({
      ...pageData,
      fields: pageData.fields.map((field) => {
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

  const savePageData = (e) => {
    if (!e) {
      FETCH.putData(`${API_URL}/pages/${webPageId}`, pageData);
      return;
    }
    e.preventDefault();

    FETCH.putData(`${API_URL}/pages/${webPageId}`, pageData,)
      .then((response) => setStatusMessage(response, getPageData, 'Page was edited'));
  };

  const deleteWepPage = () => {
    FETCH.deleteData(`${API_URL}/pages/${pageData.id}`)
      .then((response) => setStatusMessage(response, setIsDeleted(true), 'Page was archived'));
  };

  const saveSectionOrder = (sectionId, order) => {
    FETCH.putData(`${API_URL}/sections/order/${sectionId}`, { sectionId: +sectionId, order })
      .then((response) => {
        setStatusMessage(response, null, 'Section order was changed');

        if (response.ok) {
          savePageData();
        }
      });
  };

  const changeSectionsOrder = (changingSections) => {
    const updatedSections = sectionsData.map((section) => {
      if (section.id === changingSections.sectionA.id) {
        return {
          ...section,
          order: changingSections.sectionA.order,
        };
      }

      if (section.id === changingSections.sectionB.id) {
        return {
          ...section,
          order: changingSections.sectionB.order,
        };
      }

      return section;
    });

    setSectionsData(updatedSections);
    updatedSections.forEach(({ id, order }) => saveSectionOrder(id, order));
  };

  const handleSectionsOrder = (e) => {
    const { direction, sectionId } = e.currentTarget.dataset;
    const changingSections = {
      sectionA: null,
      sectionB: null,
    };

    sectionsData.forEach((section, i) => {
      if (sectionsData[i].id === +sectionId && direction === 'down' && i < (sectionsData.length - 1)) {
        changingSections.sectionA = {
          id: section.id,
          order: sectionsData[i + 1].order,
        };
        changingSections.sectionB = {
          id: sectionsData[i + 1].id,
          order: section.order,
        };
      }

      if (sectionsData[i].id === +sectionId && direction === 'up' && i > 0) {
        changingSections.sectionA = {
          id: section.id,
          order: sectionsData[i - 1].order,
        };
        changingSections.sectionB = {
          id: sectionsData[i - 1].id,
          order: section.order,
        };
      }
    });

    if (changingSections.sectionA && changingSections.sectionB) {
      changeSectionsOrder(changingSections);
      savePageData();
    }
  };

  const handlePublish = () => {
    const publishMethod = pageData.publishedAt ? FETCH.putData : FETCH.postData;
    const publishMessage = pageData.publishedAt
      ? 'Published page was updated'
      : 'Page was published';

    publishMethod(`${API_URL}/publish`, { webPageId })
      .then((response) => {
        setStatusMessage(response, getPageData, publishMessage);
      });
  };

  const handleUnPublish = () => {
    FETCH.deleteData(`${API_URL}/publish/${webPageId}`)
      .then((response) => {
        setStatusMessage(response, getPageData, 'Page was unpublished');
      });
  };

  const handleAddRedirect = (slug) => {
    const redirectData = {
      domainId: +domainId,
      webPageId: +webPageId,
      slug,
    };

    FETCH.postData(`${API_URL}/redirects`, { redirectData })
      .then((response) => {
        setStatusMessage(response, getPageData, 'Redirect was added');

        if (response.ok) {
          getPageData();
        }
      });
  };

  const handleDeleteRedirect = (e) => {
    const { redirectId } = e.currentTarget.dataset;

    FETCH.deleteData(`${API_URL}/redirects/${redirectId}`)
      .then((response) => {
        setStatusMessage(response, getPageData, 'Redirect was deleted');

        if (response.ok) {
          getPageData();
        }
      });
  };

  const getSortedSections = useMemo(() => (
    sectionsData.sort((a, b) => a.order - b.order)
  ), [sectionsData]);

  return (
    <Page
      className={classes.root}
      title="Edit Page"
    >
      {isDeleted && (<Redirect to={`/pages/${domainId}`} />)}
      <Container maxWidth="lg">
        {pageData && (
          <PageEditHeader
            name="Edit Page"
            title={pageData.title}
            isHomePage={pageData.isHomePage}
            pageData={pageData}
          />
        )}
        {pageData && (
          <PageEditButtons
            pageId={pageData.id}
            isHomePage={pageData.isHomePage}
            isPublished={Boolean(pageData.publishedAt)}
            handleDelete={deleteWepPage}
            handlePublish={handlePublish}
            handleUnPublish={handleUnPublish}
          />
        )}
        <Divider className={classes.divider} />
        <Card>
          <CardContent>

            {pageData && (
              <FormPageEdit
                fields={pageData.fields}
                className={classes.section}
                handleSubmit={savePageData}
                handleChange={handlePageDataInputChange}
              />
            )}

            {pageData && (
              <PageRedirectControl
                redirectsData={redirectsData}
                handleAddRedirect={handleAddRedirect}
                handleDeleteRedirect={handleDeleteRedirect}
              />
            )}

            {getSortedSections.map((section, i) => (
              <SectionEditForm
                sectionData={section}
                index={i}
                maxIndex={sectionsData.length - 1}
                className={classes.section}
                getPageData={getPageData}
                savePageData={savePageData}
                handleChangeOrder={handleSectionsOrder}
                key={section.id}
              />
            ))}

            {pageData && (
              <SectionAddForm
                pageId={pageData.id}
                className={classes.section}
                schemas={sectionsSchemas}
                newSectionOrder={sectionsData.length + 1}
                getPageData={getPageData}
              />
            )}

          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default PageEdit;
