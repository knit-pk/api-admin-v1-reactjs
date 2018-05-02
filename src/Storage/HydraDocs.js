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
    id,
    range,
    required,
    description,
    maxCardinality,
    reference: reference !== null ? reference.id : null,
  });
}

/**
 * @param {Array<Object>} fields
 * @param {Map<String,Field>} fieldsById
 * @param {Set<Field>} fieldSet
 *
 * @returns {Array<Field>}
 */
function resolveFields(fields, fieldsById, fieldSet) {
  return fields.map((field) => {
    if (fieldsById.has(field.id)) {
      return fieldsById.get(field.id);
    }

    const mappedField = makeField(field);
    fieldsById.set(field.id, mappedField);
    fieldSet.add(mappedField);
    return mappedField;
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
    const resolvedReadableFields = resolveFields(readableFields, fieldsById, fields);
    const resolvedWritableFields = resolveFields(writableFields, fieldsById, fields);

    const mappedResource = new Resource(name, url, {
      id,
      title,
      readableFields: resolvedReadableFields,
      writableFields: resolvedWritableFields,
      fields: Array.from(fieldsById.values()),
    });

    resourcesById.set(id, mappedResource);

    return mappedResource;
  });

  // Resolve references
  for (const field of fields) { // eslint-disable-line
    if (field.reference !== null) {
      field.reference = resourcesById.has(field.reference) ? resourcesById.get(field.reference) : null;
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
