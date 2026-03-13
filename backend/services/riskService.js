/**
 * Rule-based risk classification.
 * Returns risk_level_id (1=High, 2=Moderate, 3=Safe)
 */
function calculateRiskLevelId(cgpa, attendance) {
  cgpa       = parseFloat(cgpa);
  attendance = parseFloat(attendance);

  if (cgpa < 5 && attendance < 60)            return 1; // High Risk
  if ((cgpa >= 5 && cgpa <= 7) || (attendance >= 60 && attendance <= 75)) return 2; // Moderate
  if (cgpa > 7 && attendance > 75)             return 3; // Safe
  // Edge-case: one good, one borderline → moderate
  return 2;
}

/**
 * Rule-based AI suggestions (no external API needed).
 */
function generateAISuggestions(student) {
  const { name, cgpa, attendance, level_name } = student;
  const suggestions = [];

  if (cgpa < 5) {
    suggestions.push(`📚 ${name} has a CGPA of ${cgpa}. Recommend enrolling in peer tutoring sessions and weekly faculty consultations.`);
    suggestions.push(`🗓️ Suggest creating a structured daily study plan (minimum 4 hours/day) focusing on weakest subjects.`);
    suggestions.push(`📝 Advise the student to attempt past-year question papers and seek academic mentoring.`);
  } else if (cgpa <= 7) {
    suggestions.push(`📖 CGPA of ${cgpa} is moderate. Encourage additional practice on complex topics and group study.`);
    suggestions.push(`🎯 Set a target CGPA improvement of 0.5 per semester with bi-weekly counsellor check-ins.`);
  } else {
    suggestions.push(`⭐ Excellent CGPA of ${cgpa}! Encourage participation in research projects or internships.`);
  }

  if (attendance < 60) {
    suggestions.push(`⚠️ Critical attendance of ${attendance}%. Immediate intervention required — schedule a family meeting.`);
    suggestions.push(`📞 Contact student and guardians to understand barriers to attendance (transport, health, motivation).`);
  } else if (attendance <= 75) {
    suggestions.push(`📅 Attendance is ${attendance}%. Counsel the student on the importance of regular attendance for exam eligibility.`);
    suggestions.push(`✅ Set up a weekly attendance tracking system with reminders from the counsellor.`);
  } else {
    suggestions.push(`✅ Great attendance of ${attendance}%! Maintain consistency and stay engaged in classroom activities.`);
  }

  if (level_name === 'High Risk') {
    suggestions.push(`🚨 HIGH RISK student — prioritize for immediate counselling session within this week.`);
    suggestions.push(`📋 Create a personalised improvement plan with monthly milestones and progress reviews.`);
  }

  return suggestions;
}

module.exports = { calculateRiskLevelId, generateAISuggestions };
