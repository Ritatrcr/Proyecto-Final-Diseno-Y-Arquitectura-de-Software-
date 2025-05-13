const request = require('supertest');
const app = require('../index');
const generateTestToken = require('../utils/generateTestToken');

const token = `Bearer ${generateTestToken()}`;

describe('Refunds API', () => {
  let createdRefundId;

  it('debe crear un reembolso', async () => {
    const res = await request(app)
      .post('/api/refunds')
      .set('Authorization', token)
      .send({
        payment_id: 'testpaymentid', // Asegúrate de tener uno válido en pruebas reales
        amount: 50,
        reason: 'Test reason'
      });

    expect(res.statusCode).toBe(201);
    createdRefundId = res.body.refund_id;
  });

  it('debe obtener todos los reembolsos del usuario', async () => {
    const res = await request(app)
      .get('/api/refunds')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debe obtener un reembolso por ID', async () => {
    const res = await request(app)
      .get(`/api/refunds/${createdRefundId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.refund_id).toBe(createdRefundId);
  });

  it('debe actualizar estado de reembolso por webhook', async () => {
    const res = await request(app)
      .put('/api/refunds/webhook')
      .send({
        event_type: 'refund_status_update',
        data: {
          refund_id: createdRefundId,
          new_status: 'approved'
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Refund status updated');
  });

  it('debe eliminar un reembolso', async () => {
    const res = await request(app)
      .delete(`/api/refunds/${createdRefundId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Refund deleted successfully');
  });
});
