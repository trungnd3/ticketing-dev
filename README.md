# Ticketing dev

A tickets management project including separated services with their own responsibility.

## Services:

1. Client: NextJS - UI/UX
2. Auth: NodeJS - User management
3. Tickets: NodeJS - CRUD for tickets
4. Common: NodeJS - Error handling functions and middlewares that are shared among the services
5. Infra: Kubernetes configuration for the services

## Development:

In the root directory, run `skaffold dev` command to start the all the services
