import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { getSuggestions } from "./openai";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const target = event.queryStringParameters?.target;
    const preference = event.queryStringParameters?.preference;
    if (!target) throw new Error("Target cannot be empty");

    const suggestions = await getSuggestions(target, preference);
    return {
      statusCode: 200,
      body: JSON.stringify({
        results: suggestions,
        ok: true,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
