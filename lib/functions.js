// import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// Add a callback for progress
export async function uploadPublicContent(files, onProgress, onFileChange) {
  try {
    const generalRef = doc(db, "System", "general");

    const uploadedResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onFileChange(i);

      // Get the current contentId from Firestore (before increment)
      const generalSnap = await getDoc(generalRef);
      let contentId = 1;

      if (
        generalSnap.exists() &&
        generalSnap.data().last_public_content !== undefined
      ) {
        contentId = generalSnap.data().last_public_content + 1;
        await updateDoc(generalRef, {
          last_public_content: increment(1),
        });
      } else {
        await setDoc(generalRef, { last_public_content: 1 }, { merge: true });
      }

      const paddedId = String(contentId).padStart(4, "0");
      const extension = file.name.split(".").pop();
      const storageRef = ref(storage, `public/${paddedId}.${extension}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            onProgress(file.name, percent);
          },
          reject,
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, "Public"), {
              name: paddedId,
              url: downloadURL,
              time: serverTimestamp(),
              type: file.type.startsWith("video") ? "video" : "image",
            });
            onProgress(file.name, 100);
            resolve();
          }
        );
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadPrivateContent(files, onProgress, onFileChange) {
  try {
    const generalRef = doc(db, "System", "general");

    const uploadedResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onFileChange(i);

      // Get the current contentId from Firestore (before increment)
      const generalSnap = await getDoc(generalRef);
      let contentId = 1;

      if (
        generalSnap.exists() &&
        generalSnap.data().last_private_content !== undefined
      ) {
        contentId = generalSnap.data().last_private_content + 1;
        await updateDoc(generalRef, {
          last_private_content: increment(1),
        });
      } else {
        await setDoc(generalRef, { last_private_content: 1 }, { merge: true });
      }

      const paddedId = String(contentId).padStart(4, "0");
      const extension = file.name.split(".").pop();
      const storageRef = ref(storage, `private/${paddedId}.${extension}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            onProgress(file.name, percent);
          },
          reject,
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, "Private"), {
              name: paddedId,
              url: downloadURL,
              time: serverTimestamp(),
              type: file.type.startsWith("video") ? "video" : "image",
            });
            onProgress(file.name, 100);
            resolve();
          }
        );
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}

const createVideoThumbnail = (file) =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;

    const reader = new FileReader();
    reader.onload = () => {
      video.src = reader.result;
      video.onloadeddata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.7);
      };
    };
    reader.readAsDataURL(file);
  });
