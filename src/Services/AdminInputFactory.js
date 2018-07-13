import React from 'react';
import {
  required, TextInput, LongTextInput, DisabledInput,
} from 'react-admin';
import { ColorInput } from 'react-admin-color-input';
import { SCHEMA_ID_COLOR, SCHEMA_ID_ARTICLE_BODY } from '../DocumentationParser/SchemaOrg';

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
      return <LongTextInput key={input.name} source={input.name} label={input.name} options={{ multiline: true }} {...props} />;

    default:
      return factory(input, options);
  }
};

export default customizeInputFactory;
