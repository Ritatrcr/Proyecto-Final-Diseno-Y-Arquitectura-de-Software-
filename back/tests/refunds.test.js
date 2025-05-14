const request = require('supertest');
const app = require('../index');

const token = 'mocked_token';
let createdRefundId;

describe('Refunds API', () => {
  it('debe crear un reembolso', async () => {
    const res = await request(app)
      .post('/refunds')
      .set('Authorization', token)
      .send({ reason: 'Producto defectuoso' });

    expect(res.statusCode).toBe(201);
    createdRefundId = res.body.refund_id;
  });

  it('debe obtener todos los reembolsos del usuario', async () => {
    const res = await request(app)
      .get('/refunds')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debe obtener un reembolso por ID', async () => {
    const res = await request(app)
      .get(`/refunds/${createdRefundId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.refund_id).toBe(createdRefundId);
  });

  it('debe actualizar estado de reembolso por webhook', async () => {
    const res = await request(app)
      .post(`/refunds/webhook/${createdRefundId}`)
      .send({ status: 'aprobado' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Refund status updated');
  });

  it('debe eliminar un reembolso', async () => {
    const res = await request(app)
      .delete(`/refunds/${createdRefundId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Refund deleted successfully');
  });
});
