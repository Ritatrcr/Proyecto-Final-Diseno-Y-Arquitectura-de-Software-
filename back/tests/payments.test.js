const request = require('supertest');
const app = require('../index'); 
const generateTestToken = require('../utils/generateTestToken');

const token = `Bearer ${generateTestToken()}`;

describe('Payments API', () => {
  let createdPaymentId;

  it('debe crear un nuevo pago', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', token)
      .send({
        amount: 100,
        currency: 'USD',
        payment_method: 'card',
        description: 'Test payment'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.payment_id).toBeDefined();
    createdPaymentId = res.body.payment_id;
  });

  it('debe obtener todos los pagos del usuario', async () => {
    const res = await request(app)
      .get('/api/payments')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debe obtener un pago por ID', async () => {
    const res = await request(app)
      .get(`/api/payments/${createdPaymentId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.payment_id).toBe(createdPaymentId);
  });

  it('debe actualizar el estado del pago vía webhook', async () => {
    const res = await request(app)
      .put('/api/payments/webhook')
      .send({
        event_type: 'payment_status_update',
        data: {
          payment_id: createdPaymentId,
          new_status: 'completed'
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Payment status updated');
  });

  it('debe eliminar un pago', async () => {
    const res = await request(app)
      .delete(`/api/payments/${createdPaymentId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Payment deleted successfully');
  });
});
