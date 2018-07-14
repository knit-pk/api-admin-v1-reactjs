
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
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
        title,
        commentsCount,
      } = mapBy('name', articles.fields);


      articles.listFields = [title, commentsCount];

      const {
        url,
        originalName,
      } = mapBy('name', images.fields);

      images.listFields = [url, originalName];
      images.listProps = {
        addIdField: false,
      };

      url.denormalizeData = value => ({ src: value });
      url.normalizeData = ({ dropzone, src }) => ((dropzone && dropzone.rawFile instanceof File) ? dropzone.rawFile : src);
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
