import sanityClient from "@sanity/client"
import imageUrlBuilder from '@sanity/image-url'

const client = sanityClient({
    projectId: 'drlnuwv8',
    dataset: 'production',
    apiVersion: '2022-11-29',
    useCdn: false
});

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

export async function get() {
    const data = await client.fetch(`*[_type == "MDContent"]`);
    if (data) {
      return {
        status: 200,
        body: {
          textArr: data
        }
      };
    }
    return {
      status: 500,
      body: new Error("Internal Server Error")
    };
  }