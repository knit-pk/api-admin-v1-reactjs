import React from 'react';
import { TextField } from 'react-admin';
import { ColorField } from 'react-admin-color-input';
import Markdown from '../DocumentationParser/Markdown';
import { SCHEMA_ID_COLOR, SCHEMA_ID_ARTICLE_BODY } from '../DocumentationParser/SchemaOrg';

const customizeFieldFactory = factory => (field, options) => {
  if (field.field || field.reference !== null) {
    return factory(field, options);
  }

  const props = { ...field.fieldProps };

  if (field.name === 'metadata') {
    return ([
      <TextField key="metadata.title" source="metadata.title" label="Metadata title" {...props} />,
      <TextField key="metadata.description" source="metadata.description" label="Metadata description" {...props} />,
    ]);
  }

  switch (field.id) {
    case SCHEMA_ID_COLOR:
      return <ColorField key={field.name} source={field.name} {...props} />;

    case SCHEMA_ID_ARTICLE_BODY:
      return <Markdown key={field.name} source={field.name} {...props} />;

    default:
      return factory(field, options);
  }
};

export default customizeFieldFactory;
