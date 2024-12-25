import { v2 as cloduinary } from "cloudinary";
import {
  CLOUD_NAME_CLOUDINARY,
  API_KEY_CLOUDINARY,
  API_SECRET_CLOUDINARY,
} from "@env";

cloduinary.config({
  cloud_name: CLOUD_NAME_CLOUDINARY,
  api_key: API_KEY_CLOUDINARY,
  api_secret: API_SECRET_CLOUDINARY,
});

export default cloduinary;
