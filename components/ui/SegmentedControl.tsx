import styles from "./ui.module.css";

interface SegmentedOption {
  disabled?: boolean;
  label: string;
  value: string;
}

interface SegmentedControlProps {
  label: string;
  onValueChange: (value: string) => void;
  options: ReadonlyArray<SegmentedOption>;
  value: string;
}

export function SegmentedControl({
  label,
  onValueChange,
  options,
  value,
}: SegmentedControlProps) {
  return (
    <div aria-label={label} className={styles.segmented} role="group">
      {options.map((option) => (
        <button
          aria-pressed={value === option.value}
          disabled={option.disabled}
          key={option.value}
          onClick={() => onValueChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
