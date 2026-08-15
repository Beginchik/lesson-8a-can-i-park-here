export type CourseLessonId = "8a";

export function LessonPicker({ activeLesson: _activeLesson, onSelect: _onSelect }: { activeLesson: CourseLessonId; onSelect: (lesson: CourseLessonId) => void }) {
  return (
    <div aria-label="Current lesson" className="lesson-picker" role="group">
      <button aria-pressed="true" type="button">
        <span>8A</span>
        Can I park here?
      </button>
    </div>
  );
}
