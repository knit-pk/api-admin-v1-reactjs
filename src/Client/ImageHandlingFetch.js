import generateUrl from '../Services/UrlGenerator';
import { IMAGE_RESOURCE } from '../Config';


const addImageUploadCapabilities = fetch => (url, options = {}) => {
  if (url === generateUrl(IMAGE_RESOURCE) && options.body instanceof FormData && options.method === 'POST') {
    url = generateUrl(`${IMAGE_RESOURCE}/upload`);
  }

  return fetch(url, options);
};

export default addImageUploadCapabilities;
