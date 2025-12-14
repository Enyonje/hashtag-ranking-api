import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import swaggerDocument from './swagger.json';

const router = Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;



const spec = {
  openapi: '3.0.0',
  info: { title: 'Hashtag Ranking API', version: '1.0.0' },
  servers: [{ url: '/v1' }],
  paths: {
    '/hashtags/rank': {
      get: {
        summary: 'Rank hashtags',
        parameters: [
          { name: 'platform', in: 'query', required: true, schema: { type: 'string', enum: ['tiktok','instagram','x','youtube'] } },
          { name: 'keyword', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
        ],
        responses: { '200': { description: 'OK' } }
      }
    }
  }
};

export function mountDocs(router: Router) {
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}