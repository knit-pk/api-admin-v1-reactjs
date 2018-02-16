import CircularJSON from 'circular-json';
import Api from '@api-platform/api-doc-parser/lib/Api';
import Resource from '@api-platform/api-doc-parser/lib/Resource';
import Field from '@api-platform/api-doc-parser/lib/Field';
import { havingItem } from './LocalStorage';

/**
 * Makes a field from bare object
 *
 * @param {*} param0
 *
 * @returns {Field}
 */
function makeField({
  name, id, range, reference, required, description, maxCardinality,
}) {
  return new Field(name, {
    id, range, reference, required, description, maxCardinality,
  });
}

/**
 * @param {Array<Object>} resources
 *
 * @returns {Array<Resource>}
 */
function makeResources(resources) {
  const resourcesById = new Map();
  const fields = new Set();

  const mappedResources = resources.map(({
    name, url, id, title, readableFields, writableFields,
  }) => {
    const fieldsById = new Map();

    const mappedReadableFields = readableFields.map((field) => {
      if (fieldsById.has(field.id)) {
        return fieldsById.get(field.id);
      }

      const mappedField = makeField(field);
      fieldsById.set(field.id, mappedField);
      fields.add(mappedField);
      return mappedField;
    });

    const mappedWritableFields = writableFields.map((field) => {
      if (fieldsById.has(field.id)) {
        return fieldsById.get(field.id);
      }

      const mappedField = makeField(field);
      fieldsById.set(field.id, mappedField);
      fields.add(mappedField);
      return mappedField;
    });

    const mappedResource = new Resource(name, url, {
      id,
      title,
      fields: Array.from(fieldsById.values()),
      readableFields: mappedReadableFields,
      writableFields: mappedWritableFields,
    });

    resourcesById.set(id, mappedResource);

    return mappedResource;
  });

  // Resolve references
  for (let field of fields) { // eslint-disable-line
    if (field.reference !== null) {
      field.reference = resourcesById.has(field.reference.id) ? resourcesById.get(field.reference.id) : null;
    }
  }

  return mappedResources;
}

/**
 * Parse hydra docs Api object from encoded JSON string
 *
 * @param {Object} docs
 *
 * @returns {Api}
 */
function makeHydraApi({ entrypoint, title, resources }) {
  return new Api(entrypoint, {
    title,
    resources: makeResources(resources),
  });
}

/**
 *
 * @param {String} encoded JSON string
 *
 * @returns {Object} an hydra docs object
 */
function parseHydraDocs(encoded) {
  return CircularJSON.parse(encoded);
}

/**
 * @param {Api} docs
 *
 * @returns {String} encoded JSON string
 */
function stringifyHydraDocs(docs) {
  return CircularJSON.stringify(docs);
}

export const havingHydraDocs = (callback, defaultValue = null) => havingItem('hydra_api', docs => callback(makeHydraApi(parseHydraDocs(docs))), defaultValue);

export const getTokenPayload = () => havingHydraDocs(payload => payload);

export const storeHydraDocs = api => localStorage.setItem('hydra_api', stringifyHydraDocs(api));

export const removeHydraDocs = () => localStorage.removeItem('hydra_api');
