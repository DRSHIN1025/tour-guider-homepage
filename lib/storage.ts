import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { getStorageInstance } from './firebase';

// 파일 업로드
export const uploadFile = async (
  file: File,
  path: string
): Promise<string> => {
  const storage = getStorageInstance();
  if (!storage) throw new Error('Firebase Storage가 초기화되지 않았습니다.');
  
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  console.log('파일이 성공적으로 업로드되었습니다:', path);
  return downloadURL;
};

// 파일 삭제
export const deleteFile = async (path: string): Promise<void> => {
  const storage = getStorageInstance();
  if (!storage) throw new Error('Firebase Storage가 초기화되지 않았습니다.');
  
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
  console.log('파일이 삭제되었습니다:', path);
};

// 파일 다운로드 URL 가져오기
export const getFileDownloadURL = async (path: string): Promise<string> => {
  const storage = getStorageInstance();
  if (!storage) throw new Error('Firebase Storage가 초기화되지 않았습니다.');
  
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};

// 파일 경로 생성
export const generateFilePath = (
  userId: string,
  fileName: string,
  folder: string = 'quotes'
): string => {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  return `${folder}/${userId}/${timestamp}.${extension}`;
};

// 폴더 내 모든 파일 목록 가져오기
export const listFilesInFolder = async (folderPath: string): Promise<string[]> => {
  const storage = getStorageInstance();
  if (!storage) throw new Error('Firebase Storage가 초기화되지 않았습니다.');
  
  const folderRef = ref(storage, folderPath);
  const result = await listAll(folderRef);
  const urls = await Promise.all(
    result.items.map(itemRef => getDownloadURL(itemRef))
  );
  return urls;
};

// 파일 크기 검증
export const validateFileSize = (file: File, maxSize: number = 15 * 1024 * 1024): boolean => {
  return file.size <= maxSize;
};

// 파일 타입 검증
export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/x-hwp',
    'application/haansofthwp',
    'application/vnd.hancom.hwp',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.hwp', '.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
}; 