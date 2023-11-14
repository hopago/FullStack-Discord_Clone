import { deleteObject, getStorage, ref } from "firebase/storage";

const storage = getStorage();

export const deleteImage = (deletedImgUrl) => {
  console.log(deletedImgUrl);
  if (Array.isArray(deletedImgUrl) && deletedImgUrl.length) {
    deletedImgUrl.map(url => {
      const deleteRef = ref(storage, `images/${url}`);

      deleteObject(deleteRef)
        .then(() => {
          console.log("File Deleted...");
        })
        .catch(err => {
          console.error(err);
          return;
        });
    });
  } else {
    const deleteRef = ref(storage, `images/${deletedImgUrl}`);

    deleteObject(deleteRef)
      .then(() => {
        console.log("File Deleted...");
      })
      .catch(err => {
        console.error(err);
        return;
      });
  }
};