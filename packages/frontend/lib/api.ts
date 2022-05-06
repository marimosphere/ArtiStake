import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const artistsDirectory = join(process.cwd(), "artists");

export const getArtistFileNames = () => fs.readdirSync(artistsDirectory);

export const getArtistByFileName = (fileName: string, fields: string[] = []) => {
  const id = fileName.replace(/\.md$/, "");
  const fullPath = join(artistsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);
  data.id = id;
  return data;
};

export const getAllArtists = (fields: string[] = []) => {
  const fileNames = getArtistFileNames();
  const artists = fileNames
    .map((fileName) => getArtistByFileName(fileName, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));  
  return artists;
};
