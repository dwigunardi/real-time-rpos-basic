import { ChangeEvent } from "react";

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const files = event.target.files;

  if (!files || files.length === 0) {
    return { file: null, displayUrl: '' };
  }

  const file = files[0];
  
  if (!file || file.size === 0 || !file.type.startsWith('image/')) {
    return { file: null, displayUrl: '' };
  }

  const displayUrl = URL.createObjectURL(file);
  return { file, displayUrl };
}