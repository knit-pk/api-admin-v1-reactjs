export const HYDRA_REFRESH_METADATA = 'HYDRA/REFRESH_METADATA';

export const hydraRefreshMetadata = delay => ({
  type: HYDRA_REFRESH_METADATA,
  delay,
});
