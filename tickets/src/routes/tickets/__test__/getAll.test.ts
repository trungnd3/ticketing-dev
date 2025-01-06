import request from 'supertest';
import { app } from '../../../app';

async function createTicket() {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'Ticket',
    price: 10.5,
  });
}

const ticketsNumber = 3;

it('can fetch a list of tickets', async () => {
  for (let i = 0; i < ticketsNumber; i++) {
    await createTicket();
  }

  const response = await request(app)
    .get('/api/tickets')
    .set('Cookie', global.signin())
    .send()
    .expect(200);

  expect(response.body.length).toEqual(ticketsNumber);
});
