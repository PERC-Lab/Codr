import { withSession } from 'next-session';
 
const dummyUser = {
  displayName: "Jon Doe",
  email: "jon.doe@example.com"
}

function handler(req, res) {
  req.session.user = dummyUser;
  res.redirect('/');
}

export default withSession(handler, {});