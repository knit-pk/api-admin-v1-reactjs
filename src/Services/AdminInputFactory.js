import React from 'react';
import { required, TextInput, DisabledInput } from 'react-admin';
import { ColorInput } from 'react-admin-color-input';

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
    case 'http://schema.org/color':
      if (!props.picker) {
        // props.picker = 'Photoshop';
        props.picker = 'Sketch';
      }

      return <ColorInput key={input.name} source={input.name} {...props} />;

    default:
      return factory(input, options);
  }
};

export default customizeInputFactory;
