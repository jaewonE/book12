import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGEING_SENDER_ID,
  appId: process.env.FB_APP_ID,
};

export enum EUploadImageFBType {
  BOOK = 'book',
  USER = 'user',
}

interface IUploadImageFB {
  fileDataURL: string;
  type: EUploadImageFBType;
}

export const uploadImageFB = async ({
  fileDataURL,
  type,
}: IUploadImageFB): Promise<string | null> => {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const imageRef = ref(storage, `${type}/${uuidv4()}.jpeg`);
    await uploadString(imageRef, fileDataURL, 'data_url');
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (e: any) {
    return null;
  }
};

interface IDeleteFileFB {
  coverImg: string;
}

export const deleteFileFB = async ({
  coverImg,
}: IDeleteFileFB): Promise<boolean> => {
  try {
    const fileDataURL = coverImg.split('?')[0];
    const {
      status,
      data: { name: path },
    } = await axios.get(fileDataURL);

    if (status === 200 && path) {
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      const deleteRef = ref(storage, path);
      await deleteObject(deleteRef);
      return true;
    }
    return false;
  } catch (e: any) {
    return false;
  }
};
