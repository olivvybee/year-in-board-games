import { config as loadEnv } from 'dotenv';
import { BASE_URL } from './constants';
import { XMLParser } from 'fast-xml-parser';

loadEnv();

export const makeRequest = async <T>(
  path: string,
  params: Record<string, string>,
  arrayPaths?: string[]
): Promise<T> => {
  const apiKey = process.env.BGG_API_KEY;
  if (!apiKey) {
    throw new Error('BGG_API_KEY environment variable not set');
  }

  const queryParams = new URLSearchParams(params);
  const url = `${BASE_URL}/${path}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const body = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    ignoreDeclaration: true,
    isArray: arrayPaths ? (_, jPath) => arrayPaths.includes(jPath) : undefined,
  });
  const parsedResponse = parser.parse(body);

  return parsedResponse;
};
