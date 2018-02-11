/**
 * Excutes callback function with item when it exists in local storage
 * @param {string} itemName
 * @param {function(string)} callback
 * @param {*} defaultValue
 *
 * @returns {*} defaultValue if item does not exists
 */
export const havingItem = (itemName, callback, defaultValue = null) => {
  const item = localStorage.getItem(itemName);
  if (item !== null) {
    return callback(item);
  }

  return defaultValue;
};

/**
 * Removes items from local storage
 * @param {...string} itemNames
 */
export const removeItems = (...itemNames) => itemNames.forEach(itemName => localStorage.removeItem(itemName));
