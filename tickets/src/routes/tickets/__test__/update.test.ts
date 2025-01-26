import request from 'supertest';

import { app } from '../../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import Ticket from '../../../models/ticket';

describe('ticket update', () => {
  let id: string;

  beforeEach(() => {
    id = new mongoose.Types.ObjectId().toHexString();
  });

  it('returns 404 if the provided id does not exist', async () => {
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'Ticket1',
        price: 25,
      })
      .expect(404);
  });

  it('returns 401 if the user is not authenticated', async () => {
    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: 'Ticket1',
        price: 25,
      })
      .expect(401);
  });

  it('returns 401 if the user does not own the ticket', async () => {
    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', global.signin())
      .send({
        title: 'Ticket1',
        price: 25,
      });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({ title: 'Ticket2', price: 32 })
      .expect(401);
  });

  it('returns 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({
        title: 'Ticket1',
        price: 25,
      });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: '', price: 32 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'Title2', price: -2 })
      .expect(400);
  });

  it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({
        title: 'Ticket1',
        price: 25,
      });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'Ticket2', price: 32 })
      .expect(200);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send();

    expect(ticketResponse.body.title).toEqual('Ticket2');
    expect(ticketResponse.body.price).toEqual(32);
  });
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'Ticket1',
      price: 25,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Ticket2', price: 32 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects update if the ticket is reserved', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'Ticket1',
      price: 25,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Ticket2', price: 32 })
    .expect(400);
});
