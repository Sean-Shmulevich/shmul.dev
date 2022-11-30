import sanityClient from "@sanity/client"

const client = sanityClient({
    projectId: 'drlnuwv8',
    dataset: 'production',
    apiVersion: '2022-11-29',
    useCdn: false
});

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