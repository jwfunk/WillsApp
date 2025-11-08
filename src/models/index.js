// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { YoutubeLinks } = initSchema(schema);

export {
  YoutubeLinks
};