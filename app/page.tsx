'use client'
import styles from './page.module.css';
import Balances from '@/components/balances';

export default function Home() {
  return (
      <main className={styles.main}>
        <Balances></Balances>
      </main>
  );
}
