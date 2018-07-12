import React from 'react';
import { ColorField } from 'react-admin-color-input';

const customizeFieldFactory = factory => (field, options) => {
  if (field.field || field.reference !== null) {
    return factory(field, options);
  }

  const props = { ...field.fieldProps };

  switch (field.id) {
    case 'http://schema.org/color':
      return <ColorField key={field.name} source={field.name} {...props} />;

    default:
      return factory(field, options);
  }
};

export default customizeFieldFactory;
