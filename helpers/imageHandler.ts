import { readFileSync, writeFileSync } from "fs";
import { v4 as uuid } from "uuid";
import { Blob } from "node:buffer";

export const getImageFromUrl = (imageUrl: string | undefined) => {
  console.log(imageUrl);
  if (!imageUrl) return undefined;
  try {
    const image = readFileSync("./images/" + imageUrl);
    return image;
  } catch (e) {
    return undefined;
  }
};

export const createImageFile = (image: string) => {
  const regex = new RegExp("image/(.*);base64,");

  const imageFileName = uuid() + "." + image.match(regex)![1];
  const imageFilePath = "./images/" + imageFileName;
  image = image.replace(/^data:image\/(.*);base64,/, "");
  const data = Buffer.from(image, "base64");
  writeFileSync(imageFilePath, data, "base64");

  return imageFileName;
};
