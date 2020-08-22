import Layout from '@/layout'

const messageManagerRouter = {
  path: '/message-manager',
  name: 'messageManager',
  component: Layout,
  hidden: true,
  meta: {
    title: () => '消息列表'
  },
  children: [
    {
      name: 'Message',
      component: () => import('@/views/message'),
      path: 'message',
      meta: {
        title: () => '消息列表'
      }
    }
  ]
}

export default messageManagerRouter
