import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './firebase';

// 파일 업로드 결과 타입
export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
}

// 파일 업로드
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${path}/${fileName}`;
    const storageRef = ref(storage, filePath);

    // 파일 업로드
    const snapshot = await uploadBytes(storageRef, file);
    
    // 다운로드 URL 생성
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('파일 업로드 실패:', error);
    throw new Error('파일 업로드에 실패했습니다.');
  }
}

// 여러 파일 업로드
export async function uploadMultipleFiles(
  files: File[],
  path: string,
  onProgress?: (progress: number, fileName?: string) => void
): Promise<FileUploadResult[]> {
  try {
    const results: FileUploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${path}/${fileName}`;
      const storageRef = ref(storage, filePath);

      // 파일 업로드
      const snapshot = await uploadBytes(storageRef, file);
      
      // 다운로드 URL 생성
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // 진행률 콜백
      if (onProgress) {
        const progress = ((i + 1) / files.length) * 100;
        onProgress(progress, file.name);
      }
      
      results.push({
        url: downloadURL,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date()
      });
    }
    
    return results;
  } catch (error) {
    console.error('여러 파일 업로드 실패:', error);
    throw new Error('여러 파일 업로드에 실패했습니다.');
  }
}

// 파일 크기 검증
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

// 파일 타입 검증
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

// 파일 삭제
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('파일 삭제 실패:', error);
    throw new Error('파일 삭제에 실패했습니다.');
  }
}

// 폴더 내 모든 파일 삭제
export async function deleteFolder(folderPath: string): Promise<void> {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    // 폴더 내 모든 파일 삭제
    const deletePromises = result.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
    
    // 하위 폴더도 재귀적으로 삭제
    const subFolderPromises = result.prefixes.map(prefixRef => 
      deleteFolder(prefixRef.fullPath)
    );
    await Promise.all(subFolderPromises);
  } catch (error) {
    console.error('폴더 삭제 실패:', error);
    throw new Error('폴더 삭제에 실패했습니다.');
  }
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 파일 타입 확인
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

// 이미지 파일인지 확인
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

// PDF 파일인지 확인
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf';
}

// 파일 확장자 추출
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}