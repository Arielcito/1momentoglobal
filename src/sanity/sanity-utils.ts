import ImageUrlBuilder from "@sanity/image-url";
import { createClient, type QueryParams } from "next-sanity";
import clientConfig from "./config/client-config";

export const client = createClient(clientConfig);

export function imageBuilder(source: string) {
	return ImageUrlBuilder(clientConfig).image(source);
}
