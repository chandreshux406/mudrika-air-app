function formatDuration(totalSeconds) {
  const s = Math.round(totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function formatPace(totalSeconds) {
  const s = Math.round(totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}'${String(sec).padStart(2, '0')}"/km`;
}

const RULES = [
  {
    test: /oxygen|spo2|sp02|saturation/,
    reply: (day) => {
      if (!day.bloodOxygen) {
        return "You don't have any blood oxygen readings logged for this day, so I can't give you a number — try picking a tracked day.";
      }
      const { value, status } = day.bloodOxygen;
      return `Your blood oxygen (SpO2) is ${Math.round(value)}%, which is marked as "${status}". Healthy resting SpO2 is typically 95–100%, so you're in a good range.`;
    },
  },
  {
    test: /heart rate|bpm|pulse|hr\b/,
    reply: (day) => {
      if (!day.heartRate) {
        return "There's no heart rate data logged for this day. Wear your tracker to get a reading next time.";
      }
      const { bpm, subtitle } = day.heartRate;
      return `Your resting heart rate is ${Math.round(bpm)} BPM (${subtitle.toLowerCase()}). A normal resting range for most adults is 60–100 BPM, so this looks healthy.`;
    },
  },
  {
    test: /sleep|slept|rest(ed)?\b/,
    reply: (day) => {
      if (!day.sleep) {
        return "No sleep session was recorded for this day, so I don't have anything to report.";
      }
      const { score, duration, range } = day.sleep;
      const verdict =
        score >= 80
          ? 'that is a great night of rest.'
          : score >= 60
            ? 'that is a decent night, but there is room to improve.'
            : 'that is on the lower side, try to prioritize rest tonight.';
      return `You slept ${duration} (${range}). Your sleep score is ${Math.round(score)}/100 — ${verdict}`;
    },
  },
  {
    test: /run|distance|pace|calor|steps|workout|activity|km\b/,
    reply: (day) => {
      if (!day.running) {
        return "You didn't log a run on this day. Get moving and I'll be able to tell you all about it!";
      }
      const { distanceKm, paceSeconds, durationSeconds, calories } = day.running;
      return `You ran ${distanceKm.toFixed(1)} km in ${formatDuration(durationSeconds)} at a pace of ${formatPace(
        paceSeconds,
      )}, burning about ${Math.round(calories)} kcal. Nice work!`;
    },
  },
  {
    test: /goal/,
    reply: (day) => {
      if (day.status === 'met') return `You hit your running goal for this day — nicely done!`;
      if (day.status === 'missed') return `You were tracked but came in under your running goal on this day.`;
      if (day.status === 'not-tracked') return `No activity was tracked at all on this day, so the goal wasn't met.`;
      return `That day hasn't happened yet, so there's no goal result to report.`;
    },
  },
  {
    test: /^(hi|hello|hey)\b/,
    reply: () => "Hi! I'm your health assistant. Ask me about your heart rate, sleep, blood oxygen, or today's run.",
  },
  {
    test: /thank/,
    reply: () => "You're welcome! Let me know if there's anything else about your health data you'd like to check.",
  },
];

const FALLBACK =
  "I can help with your heart rate, sleep, blood oxygen, or running activity for the day you've selected — what would you like to know?";

export function getAssistantReply(question, dayRecord) {
  const q = question.trim().toLowerCase();
  if (!q) return FALLBACK;

  for (const rule of RULES) {
    if (rule.test.test(q)) {
      return rule.reply(dayRecord);
    }
  }
  return FALLBACK;
}

export const SUGGESTED_QUESTIONS = [
  "What's my blood oxygen level?",
  "How's my heart rate?",
  'How did I sleep?',
  'Did I hit my running goal?',
];
