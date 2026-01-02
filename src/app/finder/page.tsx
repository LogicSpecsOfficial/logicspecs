// ... existing imports
import FloatingCompareBar from '@/components/finder/FloatingCompareBar';

export default function FinderPage() {
  // ... existing logic
  const category = "iPhone"; // Or your current category state

  return (
    <main>
      {/* ... filter sidebar and grid ... */}
      
      <FloatingCompareBar category={category} />
    </main>
  );
}