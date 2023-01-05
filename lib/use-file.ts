import { encode } from 'base64-arraybuffer';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export interface IUseFile {
  setFile: Dispatch<SetStateAction<File | null>>;
  fileDataURL: string | null;
}

export default function useFile(): IUseFile {
  const [file, setFile] = useState<File | null>(null);
  const [fileDataURL, setFileDataURL] = useState<string | null>(null);

  useEffect(() => {
    let fileReader: FileReader | null = null;
    let isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<EventTarget>) => {
        if (fileReader?.result && !isCancel) {
          if (fileReader.result instanceof ArrayBuffer)
            setFileDataURL(encode(fileReader.result));
          else setFileDataURL(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);
  return { setFile, fileDataURL };
}
