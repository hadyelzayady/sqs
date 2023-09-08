/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Queues: {
    Base: '/queues',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    messages: '/:queueId/messages'
  },
  Messages: {
    Base: '/messages',
    InQueue: '/produce',
    DeQueue: '/consume',
    Delete: '/:messageId/delete'
  }
} as const;
