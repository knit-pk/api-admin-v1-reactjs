import React from 'react';
import { required } from 'react-admin';
import { ColorInput } from 'react-admin-color-input';

const customizeInputFactory = factory => (input, options) => {
  if (input.input || input.reference !== null) {
    return factory(input, options);
  }

  const props = { ...input.inputProps };

  if (!props.validate && input.required) {
    props.validate = [required()];
  }

  switch (input.id) {
    case 'http://schema.org/color':
      if (!props.picker) {
        props.picker = 'Photoshop';
      }

      return <ColorInput key={input.name} source={input.name} {...props} />;

    default:
      return factory(input, options);
  }
};

export default customizeInputFactory;
