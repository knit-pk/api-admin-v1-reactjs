import React from 'react';
import { ImageField, TextField } from 'react-admin';
import { ColorField } from 'react-admin-color-input';
import { Markdown } from '../Components';
import {
  SCHEMA_ID_COLOR, SCHEMA_ID_ARTICLE_BODY, SCHEMA_ID_CONTENT_URL, SCHEMA_ID_IMAGE_OBJECT,
} from '../DocumentationParser/SchemaOrg';

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

    case SCHEMA_ID_CONTENT_URL:
      if (options.resource.id === SCHEMA_ID_IMAGE_OBJECT) {
        return ([
          <ImageField key={`${field.name}.img`} source={`${field.name}.src`} label="Image" addLabel />,
          <TextField key={`${field.name}.url`} source={`${field.name}.src`} label="Url" />,
        ]);
      }
      break;

    default:
      // Do nothing
      break;
  }

  return factory(field, options);
};

export default customizeFieldFactory;
