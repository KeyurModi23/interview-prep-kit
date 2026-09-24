
describe('Schedule Math Logic', () => {
  it('allocates questions correctly over days', () => {
    const allQuestions = [{id: 'q1'}, {id: 'q2'}];
    const days = 4;
    const scheduleDays = [];
    const qPerDay = Math.ceil(allQuestions.length / days) || 0;
    for (let i = 0; i < days; i++) {
      const qForDay = allQuestions.slice(i * qPerDay, (i + 1) * qPerDay);
      scheduleDays.push({
        day: i + 1,
        focus: 'General Prep',
        question_ids: qForDay.map(q => q.id),
        minutes: qForDay.length * 15
      });
    }
    
    expect(scheduleDays.length).toBe(4);
    expect(scheduleDays[0].day).toBe(1);
    expect(scheduleDays[0].question_ids).toContain('q1');
  });
});
