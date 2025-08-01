export async function checkAppEmbed(admin) {
  const isAppEmbedded = await admin.graphql(
    `
      query {
        app {
          title
          embedded
        }
      }
      `,
  );

  const isAppEmbeddedData = await isAppEmbedded.json();
  const isEmbedded = isAppEmbeddedData?.data?.app.embedded || false;
  return isEmbedded;
}

export async function getAppHandle(admin) {
  const appHandle = await admin.graphql(
    `
        query {
            app {
                handle
            }
        }
        `,
  );
  const appHandleData = await appHandle.json();
  const handle = appHandleData?.data?.app.handle || "";
  return handle;
}
