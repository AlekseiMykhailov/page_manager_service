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
import PageEditForm from 'src/components/WebPage/PageEditForm';
import PageEditHeader from './PageEditHeader';
import PageEditButtons from './PageEditButtons';
import RedirectControls from './RedirectControls';
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

  const [domainData, setDomainData] = useState(null);
  const [redirectsData, setRedirectsData] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [sectionsData, setSectionsData] = useState([]);
  const [publishData, setPublishData] = useState(null);

  const [pageSchema, setPageSchema] = useState(null);
  const [sectionSchemas, setSectionSchemas] = useState([]);

  const [isDeleted, setIsDeleted] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // TODO: combine into one-two fetch
  const getPageData = useCallback(() => {
    FETCH.getData(`${API_URL}/pages/${webPageId}`)
      .then((response) => {
        if (response.ok) {
          setDomainData(response.domain);
          setRedirectsData(response.redirects);
          setPageData(response.webPage);
          setSectionsData(response.sections);
          return response.webPage.domain;
        }

        setStatusMessage(response, null, 'Something went wrong...');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL, webPageId]);

  const getPageSchema = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/pages`)
      .then((response) => {
        if (response.ok) {
          setPageSchema(response.schema);
        }
      });
  }, [API_URL]);

  const getSectionSchemas = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/sections`)
      .then((response) => {
        if (response.ok) {
          setSectionSchemas(response.schemas);
        }
      });
  }, [API_URL]);

  const getPublishData = useCallback(() => {
    FETCH.getData(`${API_URL}/publish/${webPageId}`)
      .then((response) => {
        if (response.ok) {
          setPublishData(response.data);
        } else {
          setPublishData(null);
        }
      });
  }, [API_URL, webPageId]);

  useEffect(() => {
    getPageSchema();
    getSectionSchemas();
    getPageData();
    getPublishData();
  }, [getPageData, getPublishData, getSectionSchemas, getPageSchema]);

  const handlePageDataInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setPageData({ ...pageData, [name]: !pageData[name] });
    } else {
      setPageData({ ...pageData, [name]: value });
    }
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

  const saveSectionData = (sectionData) => {
    FETCH.putData(`${API_URL}/sections/${sectionData.id}`, sectionData)
      .then((response) => {
        setStatusMessage(response, getPageData, 'Section was edited');

        if (response.ok) {
          getPageData();
          savePageData();
        }
      });
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

  const handleSaveSection = (e) => {
    e.preventDefault();

    const { id } = e.target;
    const sectionData = sectionsData.find((section) => section.id === +id);

    saveSectionData(sectionData);
  };

  const changeSectionInput = (e) => {
    const { name, value } = e.target;
    const { sectionId } = e.currentTarget.dataset;
    const sectionsDataUpdated = [...sectionsData].map((section) => {
      if (section.id === +sectionId) {
        return {
          ...section,
          fields: [...section.fields].map((field) => {
            if (field.name === name) {
              return {
                ...field,
                value,
              };
            }

            return field;
          }),
        };
      }

      return section;
    });

    setSectionsData(sectionsDataUpdated);
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
    }
  };

  const addField = (e) => {
    const { sectionId } = e.currentTarget.dataset;
    const sectionData = sectionsData.find((section) => section.id === +sectionId);
    const sortedFields = sectionData.fields.sort((a, b) => a.order - b.order);
    const lastOrder = sortedFields[sortedFields.length - 1].order;
    const sectionSchema = sectionSchemas.find((schema) => schema.id === sectionData.schemaId);
    const clonableField = sectionSchema.fields.find((field) => field.clonable);
    const newField = {
      ...clonableField,
      name: `${clonableField.name}-${lastOrder + 1}`,
      order: lastOrder + 1,
      value: '',
    };
    const newSectionsData = sectionsData.map((section) => {
      if (section.id !== +sectionId) {
        return section;
      }

      return {
        ...section,
        fields: [...section.fields, newField],
      };
    });

    setSectionsData(newSectionsData);
  };

  const deleteSection = (e) => {
    const { sectionId } = e.currentTarget.dataset;

    FETCH.deleteData(`${API_URL}/sections/${sectionId}`)
      .then((response) => {
        setStatusMessage(response, getPageData, 'Section was deleted');

        if (response.ok) {
          savePageData();
        }
      });
  };

  const handlePublish = () => {
    const publishMethod = publishData ? FETCH.putData : FETCH.postData;
    const publishMessage = publishData
      ? 'Published page was updated'
      : 'Page was published';

    publishMethod(`${API_URL}/publish`, { webPageId })
      .then((response) => {
        setStatusMessage(response, getPublishData, publishMessage);

        if (response.ok) {
          savePageData();
        }
      });
  };

  const handleUnPublish = () => {
    FETCH.deleteData(`${API_URL}/publish/${webPageId}`)
      .then((response) => {
        setStatusMessage(response, getPublishData, 'Page was unpublished');

        if (response.ok) {
          savePageData();
        }
      });
  };

  const handleAddRedirect = (slug) => {
    const redirectData = {
      domainId: +domainData.id,
      webPageId: +pageData.id,
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
            homePageId={domainData.homePageId}
            pageData={pageData}
            publishData={publishData}
          />
        )}
        {pageData && (
          <PageEditButtons
            pageId={pageData.id}
            homePageId={domainData.homePageId}
            isPublished={Boolean(publishData)}
            handleDelete={deleteWepPage}
            handlePublish={handlePublish}
            handleUnPublish={handleUnPublish}
          />
        )}
        <Divider className={classes.divider} />
        <Card>
          <CardContent>

            {pageData && (
              <PageEditForm
                pageSchema={pageSchema}
                pageData={pageData}
                className={classes.section}
                handleSubmit={savePageData}
                handleChange={handlePageDataInputChange}
              />
            )}

            {pageData && (
              <RedirectControls
                redirectsData={redirectsData}
                handleAddRedirect={handleAddRedirect}
                handleDeleteRedirect={handleDeleteRedirect}
              />
            )}

            {getSortedSections.map((section, i) => (
              <SectionEditForm
                section={section}
                index={i}
                maxIndex={sectionsData.length - 1}
                className={classes.section}
                schemas={sectionSchemas}
                handleSubmit={handleSaveSection}
                handleInputChange={changeSectionInput}
                handleDelete={deleteSection}
                handleChangeOrder={handleSectionsOrder}
                handleAddField={addField}
                key={section.id}
              />
            ))}

            {pageData && (
              <SectionAddForm
                pageId={pageData.id}
                className={classes.section}
                schemas={sectionSchemas}
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
