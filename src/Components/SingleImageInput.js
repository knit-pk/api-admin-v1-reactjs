import React from 'react';
import PropTypes from 'prop-types';
import {
  TextInput, ImageField, ImageInput,
} from 'react-admin';
import { Field } from 'redux-form';

const SingleImageInput = (props) => {
  const { record, source } = props;
  const sourceSrc = `${source}.src`;

  // Edit View
  if (record['@id'] !== undefined) {
    return (<TextInput {...props} key={source} source={sourceSrc} label="Image" />);
  }

  const sourceDropzone = `${source}.dropzone`;

  // Create View
  return ([
    <Field
      key={sourceDropzone}
      component={ImageInput}
      accept="image/*"
      multiple={false}
      name={sourceDropzone}
      label="Image dropzone"
      placeholder={<p>Drop a picture to upload, or click to select it. When you do not want to upload an image use fields bellow.</p>}
    >
      <ImageField source="src" title="image" />
    </Field>,
    <TextInput {...props} key={sourceSrc} source={sourceSrc} label="Image url" validate={[]} />,
  ]);
};


SingleImageInput.defaultProps = {
  record: {},
};

SingleImageInput.propTypes = {
  record: PropTypes.object, // eslint-disable-line
  source: PropTypes.string.isRequired,
};

export default SingleImageInput;
