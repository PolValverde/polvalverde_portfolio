export const getUploadcareUrl = (image, options = '') => {
  if (!image || !image.id) return '';
  return `https://ucarecdn.com/${image.id}/${options}`;
};
