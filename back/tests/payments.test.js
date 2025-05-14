const request = require('supertest');
const app = require('../index');

const token = 'mocked_token';
let createdPaymentId;

describe('Payments API', () => {
  it('debe crear un nuevo pago', async () => {
    const res = await request(app)
      .post('/payments')
      .set('Authorization', token)
      .send({ amount: 100 });

    expect(res.statusCode).toBe(201);
    expect(res.body.payment_id).toBeDefined();
    createdPaymentId = res.body.payment_id;
  });

  it('debe obtener todos los pagos del usuario', async () => {
    const res = await request(app)
      .get('/payments')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debe obtener un pago por ID', async () => {
    const res = await request(app)
      .get(`/payments/${createdPaymentId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.payment_id).toBe(createdPaymentId);
  });

  it('debe actualizar el estado del pago vía webhook', async () => {
    const res = await request(app)
      .post(`/payments/webhook/${createdPaymentId}`)
      .send({ status: 'refunded' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Payment status updated');
  });

  it('debe eliminar un pago', async () => {
    const res = await request(app)
      .delete(`/payments/${createdPaymentId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Payment deleted successfully');
  });
});
