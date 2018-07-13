
import React from 'react';
import {
  LongTextInput, ImageField, ImageInput, TextField, TextInput,
} from 'react-admin';
import { Field } from 'redux-form';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import Markdown from './Markdown';
import resolveUser from '../Services/UserResolver';
import { storeHydraDocs, havingHydraDocs } from '../Storage/HydraDocs';

function parseHydraDocumentationForUser(jsonldEntrypoint) {
  return resolveUser()
    .then(({ authenticated, token }) => {
      const headers = {};
      if (authenticated) {
        headers.authorization = token;
      }
      return new Headers(headers);
    }).then(headers => parseHydraDocumentation(jsonldEntrypoint, { headers }))
    .then(({ api }) => {
      storeHydraDocs(api);
      return { api };
    });
}

function mapBy(key, collection) {
  return Object.assign({}, ...collection.map(item => ({ [item[key]]: item })));
}

function parseHydraDocumentationCached(jsonldEntrypoint) {
  return havingHydraDocs(api => Promise.resolve({ api }), parseHydraDocumentationForUser(jsonldEntrypoint))
    .then(({ api }) => {
      const {
        categories,
        articles,
        images,
        comments,
        comment_replies: commentReplies,
      } = mapBy('name', api.resources);

      const {
        text,
        article,
        author,
      } = mapBy('name', comments.fields);
      comments.listFields = [text, author, article];
      comments.listProps = {
        addIdField: false,
      };

      const {
        text: replyText,
        comment: replyComment,
        author: replyAuthor,
      } = mapBy('name', commentReplies.fields);
      commentReplies.listFields = [replyText, replyComment, replyAuthor];
      commentReplies.listProps = {
        addIdField: false,
      };

      categories.listFields = categories.fields.filter(({ name }) => name !== 'metadata');
      categories.listProps = {
        addIdField: false,
      };

      const {
        content,
        title,
        commentsCount,
      } = mapBy('name', articles.fields);


      articles.listFields = [title, commentsCount];
      commentsCount.field = props => (<TextField key="commentsCount" source="commentsCount" {...props} />);
      commentsCount.field.defaultProps = {
        addLabel: true,
      };

      content.field = props => (<Markdown {...props} source={props.record.content} />);
      content.input = () => (
        <LongTextInput key="content" source="content" label="Content" options={{ multiline: true }} />
      );

      const {
        url,
        originalName,
      } = mapBy('name', images.fields);

      images.listFields = [url, originalName];
      images.listProps = {
        addIdField: false,
      };

      url.field = props => (<ImageField {...props} key="url" source="url.src" title="image" name="url" label="Image" />);
      url.field.defaultProps = {
        addLabel: true,
      };

      url.input = (props) => {
        if (props.record['@id'] !== undefined) {
          return (<Field {...props} key="url" component={TextInput} source="url.src" name="url.src" label="Url" />);
        }

        return ([
          <Field
            {...props}
            key="url.image"
            component={ImageInput}
            accept="image/*"
            multiple={false}
            name="url.image"
            source="url.src"
            label="Image"
            placeholder={<p>Drop a picture to upload, or click to select it. When you do not want to upload an image use fields bellow.</p>}
          >
            <ImageField {...props} source="url.src" title="image" />
          </Field>,
          <Field {...props} key="url.src" component={TextInput} source="url.src" name="url.src" label="Url" />,
        ]);
      };

      url.denormalizeData = value => ({ src: value });
      url.normalizeData = ({ image, src }) => ((image && image.rawFile instanceof File) ? image.rawFile : src);
      images.encodeData = (data) => {
        if (data.url instanceof File) {
          const body = new FormData();
          body.set('image', data.url);
          return body;
        }

        return JSON.stringify(data);
      };

      return { api };
    });
}

export default parseHydraDocumentationCached;
