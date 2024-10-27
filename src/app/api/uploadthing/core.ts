
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing();

export const ourFileRouter = {

}

export type OurFileRouter = typeof ourFileRouter