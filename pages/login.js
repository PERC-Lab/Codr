import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { applySession } from 'next-session';

export default function Home() {
  return (
    <div className={styles.container}>
      You're not signed in!
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  await applySession(req, res);
  console.log(req, res)
  const user = req.session.user || null;

  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: {} }
}