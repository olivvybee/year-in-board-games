'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { getMonthName } from '@/utils/getMonthName';

import { Dropdown, Option } from '../Dropdown';
import { Button } from '../Button';

import styles from './SetupForm.module.css';

export const SetupForm = () => {
  const router = useRouter();

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const defaultYear = thisMonth === 11 ? thisYear : thisYear - 1;

  const [username, setUsername] = useState<string>('');
  const [year, setYear] = useState<string>(defaultYear.toString());
  const [month, setMonth] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('plays');

  const monthOptions: Option<string>[] = [{ value: '', label: 'Entire year' }];
  for (let m = 1; m <= 12; m++) {
    const monthAsString = m.toString();
    monthOptions.push({
      value: monthAsString,
      label: getMonthName(monthAsString),
    });
  }

  const onSubmit = () => {
    const params = new URLSearchParams({
      username,
      year,
      month,
      sortBy,
    });

    const newUrl = `/view?${params.toString()}`;

    router.push(newUrl);
  };

  return (
    <form className={styles.form}>
      <div className={styles.formElement}>
        <label htmlFor="username">BGG username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.textField}
        />
      </div>

      <div className={styles.formElement}>
        <label htmlFor="year">Year</label>
        <input
          type="number"
          min={2000}
          max={thisYear}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={styles.textField}
        />
      </div>

      <div className={styles.formElement}>
        <label htmlFor="month">Month</label>
        <Dropdown options={monthOptions} value={month} onChange={setMonth} />
      </div>

      <div className={styles.formElement}>
        <label htmlFor="sortBy">Metric for most played</label>

        <div className={styles.radioGroup}>
          <div className={styles.radioButton}>
            <input
              type="radio"
              name="sortBy"
              id="sortBy-plays"
              checked={sortBy === 'plays'}
              onChange={(e) => {
                if (e.target.checked) {
                  setSortBy('plays');
                }
              }}
            />
            <label htmlFor="sortBy-plays">Play count</label>
          </div>

          <div className={styles.radioButton}>
            <input
              type="radio"
              name="sortBy"
              id="sortBy-time"
              checked={sortBy === 'time'}
              onChange={(e) => {
                if (e.target.checked) {
                  setSortBy('time');
                }
              }}
            />
            <label htmlFor="sortBy-time">Time spent</label>
          </div>
        </div>
      </div>

      <Button onClick={onSubmit}>Generate</Button>
    </form>
  );
};
