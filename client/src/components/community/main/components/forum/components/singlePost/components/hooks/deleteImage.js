import { deleteObject, getStorage, ref } from "firebase/storage";

const storage = getStorage();

export const deleteImage = (url) => {
    const deleteRef = ref(storage, `images/${url}`);

    deleteObject(deleteRef)
      .then(() => {
        console.log("File Deleted...");
      })
      .catch(err => {
        console.log(err);
        return;
      });
};