import { AppShell } from "@/components/layout/AppShell";
import styles from "@/features/education/Education.module.css";

export default function LessonLoading() {
  return (
    <AppShell>
      <div
        className={styles.lessonPage}
        aria-busy="true"
        aria-label="Loading lesson"
      >
        <div
          style={{
            height: "1.5rem",
            width: "12rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.25rem",
            marginBottom: "1.5rem",
          }}
        />
        <div
          style={{
            height: "3rem",
            width: "24rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.25rem",
            marginBottom: "1rem",
          }}
        />
        <div
          style={{
            height: "4rem",
            width: "100%",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
          }}
        />
        <div
          style={{
            height: "12rem",
            width: "100%",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.75rem",
            marginBottom: "2rem",
          }}
        />
      </div>
    </AppShell>
  );
}
