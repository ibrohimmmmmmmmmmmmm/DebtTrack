import { useEffect } from 'react';
import useFolderStore from './foldersZustand';

export default function Folders() {
  const folders = useFolderStore((state) => state.folders);
  const getFolders = useFolderStore((state) => state.getFolders);

  useEffect(() => {
    getFolders();
  }, [getFolders]);

  return (
    <div>
      {folders.map((folder: any) => (
        <div key={folder.id}>
          <p>{folder.name}</p>
          <p>Color : {folder.color}</p>
          <p>Creadted At: {folder.created_at}  </p>
        </div>
      ))}
    </div>
  );
}