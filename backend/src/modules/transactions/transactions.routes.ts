import type { FastifyInstance } from 'fastify';
import { createTransactionHandler, getTransactionsHandler, getAllTransactionsHandler } from './transactions.controller';
import { createInsertSchema } from 'drizzle-zod';
import { transactions } from './transactions.schema';
import { z } from 'zod';


const insertTransactionSchema = createInsertSchema(transactions);

export async function transactionsRoutes(server: FastifyInstance) {
  server.post(
    '/:accountId/transactions',
    {
      schema: {
        summary: 'Create a new transaction',
        description: 'Creates a new transaction (deposit or withdrawal) for a given account.',
        tags: ['Transactions'],
        params: {
          type: 'object',
          properties: {
            accountId: {
              type: 'string',
              description: 'The ID of the account to create a transaction for.',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL'] },
            amount: { type: 'number' },
            reference: { type: 'string' },
            meta: { type: 'object' },
            created_by: { type: 'string', format: 'uuid' },
          },
          required: ['type', 'amount'],
        },
        response: {
          201: {
            description: 'Transaction created successfully',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              account_id: { type: 'string', format: 'uuid' },
              type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL'] },
              amount: { type: 'number' },
              reference: { type: 'string' },
              meta: { type: 'object' },
              created_at: { type: 'string', format: 'date-time' },
              created_by: { type: 'string', format: 'uuid' },
              status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'] },
            },
          },
        },
      },
    },
    createTransactionHandler
  );

  server.get(
    '/:accountId/transactions',
    {
      schema: {
        summary: 'Get all transactions for an account',
        description: 'Retrieves a list of all transactions for a specific account.',
        tags: ['Transactions'],
        params: {
          type: 'object',
          properties: {
            accountId: {
              type: 'string',
              description: 'The ID of the account to retrieve transactions for.',
            },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            all: {
              type: 'string',
              description: 'If set to "true", returns all transactions. Otherwise, returns the last 2 transactions.',
            },
          },
        },
        response: {
          200: {
            description: 'A list of transactions',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                account_id: { type: 'string', format: 'uuid' },
                type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL'] },
                amount: { type: 'number' },
                reference: { type: 'string' },
                meta: { type: 'object' },
                created_at: { type: 'string', format: 'date-time' },
                created_by: { type: 'string', format: 'uuid' },
                status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'] },
              },
            },
          },
        },
      },
    },
    getTransactionsHandler
  );

  server.get(
    '/transactions',
    {
      schema: {
        summary: 'Get all transactions',
        description: 'Retrieves a list of all transactions across all accounts.',
        tags: ['Transactions'],
        response: {
          200: {
            description: 'A list of transactions',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                account_id: { type: 'string', format: 'uuid' },
                type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL'] },
                amount: { type: 'number' },
                reference: { type: 'string' },
                meta: { type: 'object' },
                created_at: { type: 'string', format: 'date-time' },
                created_by: { type: 'string', format: 'uuid' },
                status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'] },
              },
            },
          },
        },
      },
    },
    getAllTransactionsHandler
  );
}