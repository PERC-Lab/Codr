import nextConnect from 'next-connect';
import middleware from '@/middleware';

const handler = nextConnect();
handler.use(middleware);
handler.get(async (req, res) => res.json({ user: req.user }));

export default handler;