import HeroBar from '@/components/HeroBar';
import WeatherCard from '@/components/WeatherCard';
import QuickLinks from '@/components/QuickLinks';
import Notepad from '@/components/Notepad';
import NewsPanel from '@/components/NewsPanel';
import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <>
      <HeroBar />
      <main id="main" className={styles.main}>
        <div className={styles.widgetRow}>
          <WeatherCard />
          <QuickLinks />
          <Notepad />
        </div>
        <NewsPanel />
      </main>
    </>
  );
}
