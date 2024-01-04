import styles from './Dropdown.module.css';

export interface Option<T> {
  value: T;
  label: string;
}

interface DropdownProps<T = string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const Dropdown = <T extends string>({
  options,
  value,
  onChange,
}: DropdownProps<T>) => {
  const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const index = e.currentTarget.selectedIndex;
    const option = options[index];
    onChange(option.value);
  };

  return (
    <select value={value} onChange={handleChange} className={styles.dropdown}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
