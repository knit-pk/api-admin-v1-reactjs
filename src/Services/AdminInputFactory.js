import React from 'react';
import {
  required, TextInput, LongTextInput, DisabledInput,
} from 'react-admin';
import { ColorInput } from 'react-admin-color-input';
import {
  SCHEMA_ID_COLOR, SCHEMA_ID_ARTICLE_BODY, SCHEMA_ID_CONTENT_URL, SCHEMA_ID_IMAGE_OBJECT,
} from '../DocumentationParser/SchemaOrg';
import SingleImageInput from '../DocumentationParser/SingleImageInput';

const customizeInputFactory = factory => (input, options) => {
  if (input.input || input.reference !== null) {
    return factory(input, options);
  }

  const props = { ...input.inputProps };

  if (!props.validate && input.required) {
    props.validate = [required()];
  }

  switch (input.name) {
    case 'metadata':
      return ([
        <TextInput key="metadata.title" source="metadata.title" label="Metadata title" />,
        <TextInput key="metadata.description" source="metadata.description" label="Metadata description" />,
      ]);

    case 'code':
      return <DisabledInput key="code" source="code" />;

    default:
      // Do nothing
      break;
  }

  switch (input.id) {
    case SCHEMA_ID_COLOR:
      if (!props.picker) {
        props.picker = 'Sketch'; // https://casesandberg.github.io/react-color/#usage-include
      }

      return <ColorInput key={input.name} source={input.name} {...props} />;


    case SCHEMA_ID_ARTICLE_BODY:
      return <LongTextInput key={input.name} source={input.name} options={{ multiline: true }} {...props} />;

    case SCHEMA_ID_CONTENT_URL:
      if (options.resource.id === SCHEMA_ID_IMAGE_OBJECT) {
        return <SingleImageInput key={input.name} source={input.name} {...props} />;
      }
      break;

    default:
      // Do nothing
      break;
  }

  return factory(input, options);
};

export default customizeInputFactory;
