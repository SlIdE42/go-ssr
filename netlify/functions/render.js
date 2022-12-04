import { renderToString } from "hyperapp-render";
import view from "../../hyperapp/app.mjs";

export const handler = async function (event, context) {
  return {
    statusCode: 200,
    body: renderToString(view({ ...JSON.parse(event.body), loading: true })),
  };
};
