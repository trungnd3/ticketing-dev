import axios from 'axios';
import { headers } from 'next/headers';

export async function getAllTickets() {
  try {
    const rHeaders = await headers();

    const res = await axios(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets',
      {
        headers: {
          host: rHeaders.get('host'),
          cookie: rHeaders.get('cookie'),
        },
      }
    );

    return { data: res.data };
  } catch (error) {
    return { error };
  }
}
