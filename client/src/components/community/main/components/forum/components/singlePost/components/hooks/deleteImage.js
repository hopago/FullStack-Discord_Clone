import { deleteObject, getStorage, ref } from "firebase/storage";

const storage = getStorage();

export const deleteImage = (deletedImgUrl) => {
  if (Array.isArray(deletedImgUrl) && deletedImgUrl.length) {
    let promises = [];
    deletedImgUrl.map(url => {
      const deleteRef = ref(storage, `images/${url}`);

      const promise = deleteObject(deleteRef)
        .then(() => {
          console.log("File Deleted...");
        })
        .catch(err => {
          console.error(err);
          return;
        });
      
      promises.push(promise);
    });

    Promise.all(promises)
    .then((res) => {
      console.log(res);
    })
    .catch(err => console.error(err));
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