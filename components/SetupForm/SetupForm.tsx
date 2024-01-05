'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

import { getMonthName } from '@/utils/getMonthName';

import { Dropdown, Option } from '../Dropdown';
import { Button } from '../Button';

import styles from './SetupForm.module.css';
import { Expander } from '../Expander';
import { IoHelpCircleOutline } from 'react-icons/io5';

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
  const [includeExpansions, setIncludeExpansions] = useState<boolean>(false);

  const usernameIsValid = !!username;

  const parsedYear = parseInt(year, 10);
  const yearIsValid =
    !isNaN(parsedYear) && parsedYear >= 2000 && parsedYear <= thisYear;

  const maxMonth = !yearIsValid || parsedYear < thisYear ? 12 : thisMonth + 1;

  const monthOptions: Option<string>[] = [{ value: '', label: 'Entire year' }];
  for (let m = 1; m <= maxMonth; m++) {
    const monthAsString = m.toString();
    monthOptions.push({
      value: monthAsString,
      label: getMonthName(monthAsString),
    });
  }

  useEffect(() => {
    const selectedMonth = parseInt(month, 10);
    if (!isNaN(selectedMonth) && selectedMonth > maxMonth) {
      setMonth('');
    }
  }, [month, maxMonth]);

  const onSubmit = () => {
    const params = new URLSearchParams({
      username,
      year,
      sortBy,
      includeExpansions: includeExpansions.toString(),
      ...(!!month ? { month } : {}),
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
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
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
          onChange={(e) => setYear(e.target.value.trim())}
          className={classNames(styles.textField, {
            [styles.invalid]: !yearIsValid,
          })}
        />
        {!yearIsValid && (
          <span className={styles.errorMessage}>
            Year must be a number between 2000 and {thisYear}.
          </span>
        )}
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

      <Expander
        renderTrigger={(toggle) => (
          <div className={styles.formElement}>
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="includeExpansions"
                checked={includeExpansions}
                onChange={(e) => setIncludeExpansions(e.target.checked)}
              />
              <label htmlFor="includeExpansions">Include expansions</label>
              <a
                className={styles.expanderTrigger}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggle();
                }}>
                <IoHelpCircleOutline /> What's this?
              </a>
            </div>
          </div>
        )}>
        <div className={styles.expansionExplanation}>
          <p>
            Use this option if you want to include plays of expansions separate
            to the base game. This is useful if you record plays based on the
            expansion, such as logging a specific Arkham Horror expansion to
            signify you played that specific campaign.
          </p>
          <p>
            {' '}
            BGG does not have a way to log expansions and base games as part of
            the same play, so this may end up double-counting some plays. It's
            recommended not to create separately logged plays for expansions
            because of this, or log expansions with a quantity of 0.1 when
            logging the base game as well.
          </p>
          <p>
            Standalone expansions (e.g. Wingspan Asia) will still be counted
            even if this option is disabled, because there is no way to
            differentiate a standalone expansion played by itself or integrated
            with the base game. To avoid this, only log these expansions when
            played standalone.
          </p>
        </div>
      </Expander>

      <Button onClick={onSubmit} disabled={!usernameIsValid || !yearIsValid}>
        Generate
      </Button>
    </form>
  );
};
