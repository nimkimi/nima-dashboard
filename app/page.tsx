import Clock from '@/components/Clock';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import QuickLinks from '@/components/QuickLinks';
import Notepad from '@/components/Notepad';
import NewsTabs from '@/components/NewsTabs';
import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <>
      <header>
        <Clock />
        <SearchBar />
      </header>
      <main id="main" className={styles.main}>
        <div className={styles.rowContext}>
          <WeatherCard />
          <QuickLinks />
        </div>
        <Notepad />
        <NewsTabs />
      </main>
    </>
  );
}
