import { useState, useEffect, useRef } from "react";

const DAYS = [
  { title: "Who are you becoming?", theme: "Identity", prompt: "Before any habit, any routine — you need a clear image of who you're building toward. Not a fantasy. A real, specific person you could actually become.", task: "Write 3 sentences describing the version of you that exists in 1 year. Be honest, not aspirational fluff.", reflection: "What's one thing that person does daily that you don't do yet?", opener: "Let's start with the most important question most people skip: Who exactly are you trying to become? Not vague goals — describe them to me like a real person." },
  { title: "The honest audit", theme: "Clarity", prompt: "You can't fix what you won't face. Today is about seeing yourself clearly — no shame, no excuses, just truth.", task: "List 3 habits you have right now that the future version of you would be embarrassed by.", reflection: "Which one hurts the most to admit?", opener: "Honesty day. What's one habit you currently have that you know is holding you back? No judgment — just tell me the truth." },
  { title: "One thing only", theme: "Focus", prompt: "Most people fail because they try to change everything at once. The person you're becoming didn't get there by juggling 10 new habits. They started with one.", task: "Choose ONE behavior to focus on this entire 30 days. Just one. Write it down and explain why this one matters most.", reflection: "Why have you failed to stick to this before?", opener: "If you could only change one thing about your daily behavior this month, what would it be — and why that one specifically?" },
  { title: "Your non-negotiables", theme: "Standards", prompt: "Discipline isn't about doing more. It's about deciding what you won't compromise on — and actually meaning it.", task: "Write 3 non-negotiables. Things you'll do no matter what happens today, every day from now on. Small is fine. Real is required.", reflection: "Would the future version of you respect these? Or are they still too easy?", opener: "What are 3 things you're committing to doing every single day this month — things you won't let yourself skip even on a bad day?" },
  { title: "Kill the excuse first", theme: "Ownership", prompt: "Your brain is very good at generating reasons not to start. Every excuse has a counter. Today you find yours.", task: "Write your most common excuse for not following through. Then write exactly what you'll say to yourself when it shows up.", reflection: "Has that excuse ever actually helped you?", opener: "What's the excuse you use most when you don't follow through? Tell me honestly — and let's figure out what's really behind it." },
  { title: "Environment over willpower", theme: "Systems", prompt: "Willpower is unreliable. Your environment is buildable. The person you're becoming doesn't rely on motivation — they set up their world to make the right choice easier.", task: "Change one thing in your physical environment today that makes your one focus behavior easier to do.", reflection: "What environment change would make the biggest difference that you've been putting off?", opener: "What does your current environment make easy? What does it make hard? Let's talk about what you can actually change around you." },
  { title: "The 2-minute rule", theme: "Momentum", prompt: "When you don't feel like it — and you won't sometimes — the only rule is: start for 2 minutes. Just start. The rest usually follows.", task: "Do your focus behavior for exactly 2 minutes right now if you haven't already. That's the whole task.", reflection: "What happened after the 2 minutes? Did you stop or keep going?", opener: "How do you handle days when you genuinely don't feel like doing the thing you committed to? What's your current strategy — and does it actually work?" },
  { title: "Who's watching you?", theme: "Accountability", prompt: "Accountability doesn't mean having a babysitter. It means having someone who knows what you're trying to do and will notice if you don't.", task: "Tell one person in your life what you're working on this month. It can be a text, a conversation — anything. Just say it out loud to someone.", reflection: "How did it feel to say it out loud?", opener: "Do you have anyone in your life who knows you're doing this? Accountability changes everything — who's the right person for you?" },
  { title: "Your worst day plan", theme: "Resilience", prompt: "You will have a bad day this month. Plan for it now so it doesn't derail you when it happens.", task: "Write a specific plan for your worst-case day. What's the minimum version of your commitment you'll keep even on that day?", reflection: "What usually happens the day after you skip something? Does one miss turn into two?", opener: "What does a really bad day look like for you — and what usually happens to your habits when one hits? Let's make a plan for it now." },
  { title: "Tracking without obsession", theme: "Awareness", prompt: "Tracking works. But tracking as a substitute for doing doesn't. Today you set up the simplest possible system to see your own progress.", task: "Find a way to mark each day you complete your focus behavior. A checkmark on paper, a note in your phone — anything that leaves a visible record.", reflection: "Have you ever successfully tracked a habit long-term before? What made it work or fail?", opener: "How have you tracked habits or goals in the past? Did it help — or did it become its own thing you eventually quit?" },
  { title: "The comparison trap", theme: "Identity", prompt: "Comparing yourself to others is a losing game. The only comparison that matters is you vs. you — who you were last week, last month, last year.", task: "Write one way you're genuinely better than you were 6 months ago. It doesn't have to be big. It has to be real.", reflection: "Do you spend more time looking at other people's progress or your own?", opener: "Be honest — do you ever look at other people's results and feel behind? What does that comparison actually do to your motivation?" },
  { title: "Rest is part of the plan", theme: "Sustainability", prompt: "The version of you that burns out in week 2 helps nobody. Rest isn't quitting. It's part of how you stay in the game long enough to actually change.", task: "Schedule one real recovery period this week. Not scrolling. Not half-resting. Something that actually recharges you.", reflection: "What does rest actually look like for you — not what you think it should look like?", opener: "What does genuinely recharging look like for you? Not what you're supposed to do — what actually works?" },
  { title: "The identity statement", theme: "Belief", prompt: "Language shapes identity. People who say 'I'm trying to work out' quit. People who say 'I'm someone who works out' find a way.", task: "Rewrite your focus behavior as an identity statement. Not 'I want to' or 'I'm trying to' — 'I am someone who ___.'", reflection: "Does it feel true yet? It doesn't have to. Say it anyway.", opener: "How do you talk about the things you're working on — do you say 'I'm trying to' or 'I'm someone who'? Let's talk about why that difference matters." },
  { title: "Half way check-in", theme: "Honesty", prompt: "You're almost halfway through. This is where most people quietly drift. A real check-in — not a pep talk — is what keeps you honest.", task: "Answer three questions: What's working? What's not? What needs to change in the second half?", reflection: "Are you a different person than you were on Day 1? In what way?", opener: "Real talk — how's it actually going? Not the version you'd tell someone to sound good. The honest version." },
  { title: "Dealing with failure", theme: "Recovery", prompt: "You may have already slipped up. If you haven't — you probably will. The measure of discipline isn't never failing. It's how fast you come back.", task: "Write down one time recently you didn't follow through. Then write what you did next. If you came back — great. If you spiraled — write what you'll do differently.", reflection: "Do you tend to give up after one miss, or recover quickly?", opener: "Have you slipped up at all yet? Most people have by now — tell me what happened and what you did after." },
  { title: "Your energy pattern", theme: "Optimization", prompt: "Not everyone does their best work at 6am. The person you're becoming knows when they're sharpest — and they protect that time.", task: "Identify your peak energy window during the day. Move your most important task into that window starting today.", reflection: "Have you been doing hard things at the wrong time of day?", opener: "When during the day do you feel most clear and capable — and is that when you do your most important things, or is it wasted on something else?" },
  { title: "What you consume", theme: "Input", prompt: "What goes in shapes what comes out. Your inputs — content, conversations, environments — are quietly building or quietly destroying the person you want to become.", task: "Cut one input today that you know is draining you. Social media account, group chat, YouTube rabbit hole — something that takes more than it gives.", reflection: "What do you consistently consume that you know isn't serving you?", opener: "What do you spend the most time consuming — content, conversations, environments — and honestly, is it making you better or keeping you comfortable?" },
  { title: "Do it badly", theme: "Progress", prompt: "Perfectionism kills more progress than laziness does. The person you're becoming does things imperfectly and does them anyway.", task: "Do your focus behavior today even if the conditions aren't right. Even if it's messy, rushed, or not your best. Done badly beats not done.", reflection: "Where in your life does perfectionism show up as an excuse not to start?", opener: "Are you someone who waits until conditions are right before doing something — or do you just start? Where does that tendency help you, and where does it hurt?" },
  { title: "The people around you", theme: "Environment", prompt: "You become like the people you spend the most time with. Not always. But often enough to pay attention.", task: "Name one person in your life who makes you better by being around them. Name one who doesn't. You don't have to do anything about it today — just see it clearly.", reflection: "Do the people closest to you support who you're becoming?", opener: "Do the people you spend the most time with push you forward or pull you toward staying the same? Be honest — you don't have to name names." },
  { title: "Boredom is the work", theme: "Consistency", prompt: "The secret nobody tells you: consistency is boring. The exciting part is the result. Getting there is just showing up on unremarkable days.", task: "Do the work today with zero motivation. No music, no hype, no 'getting in the zone.' Just do it plainly, quietly, completely.", reflection: "Can you find meaning in the boring repetition — or does it only feel worth it when it feels exciting?", opener: "What's your relationship with boredom? Do you run from it, tolerate it, or have you figured out how to just be okay in it?" },
  { title: "Your future self letter", theme: "Vision", prompt: "The person you're becoming is real. They exist in a future that's being built by what you do today. Talk to them.", task: "Write a short letter to the version of you that finishes this 30 days. Tell them what you did to get there.", reflection: "What would it mean to actually become that person?", opener: "If you wrote a letter to yourself 30 days from now, what would you want to be able to say you did? What would make you proud?" },
  { title: "Saying no", theme: "Boundaries", prompt: "Every yes is a no to something else. The undisciplined life isn't chaotic — it's just full of yeses to the wrong things.", task: "Say no to one thing today that you would normally say yes to out of guilt, habit, or people-pleasing.", reflection: "What do you have the hardest time saying no to — and what does that cost you?", opener: "What's something you regularly say yes to that you actually want to say no to — and what stops you from just saying no?" },
  { title: "Proof over promises", theme: "Action", prompt: "Motivation comes after action, not before. You don't wait to feel ready. You act, and the feeling follows. Your past promises mean nothing. Your present actions mean everything.", task: "Do your focus behavior before you do anything else today. First thing. Before checking your phone.", reflection: "How different does the day feel when you win the morning vs. when you lose it?", opener: "Do you tend to let yourself feel motivated before you start — or have you learned to just go before the feeling shows up?" },
  { title: "Who you're not anymore", theme: "Shedding", prompt: "Becoming someone new means letting go of who you used to be. That sounds obvious. It's harder than it sounds.", task: "Write one behavior, belief, or identity label you're actively leaving behind. Say it like it's already true: 'I'm not someone who _____ anymore.'", reflection: "Is there a version of yourself you're holding onto that's keeping you stuck?", opener: "Is there a version of yourself — a habit, a mindset, an old identity — that you know you need to leave behind but haven't fully let go of yet?" },
  { title: "The long game", theme: "Patience", prompt: "30 days doesn't change your life. It changes your trajectory. The results come later. The work comes now.", task: "Write where you realistically want to be in 6 months if you keep this going. Not a dream — a real projection based on current effort.", reflection: "Are you someone who can play a long game, or do you give up when results don't show fast?", opener: "How patient are you with slow progress? What happens to your motivation when you can't see results yet?" },
  { title: "The invisible wins", theme: "Recognition", prompt: "Most of your growth is invisible — to others and sometimes to yourself. The discipline you're building right now isn't showing yet. It's compounding.", task: "Name 3 wins from this month that no one else would notice. Internal shifts count. Quiet decisions count.", reflection: "Do you give yourself credit for the progress no one else can see?", opener: "What's something you've done or shifted in yourself this month that no one else would know about — but you know?" },
  { title: "Teach it", theme: "Mastery", prompt: "You understand something when you can explain it. If you can explain what's changed in you to someone else, it's real.", task: "Explain what you've learned about discipline this month to someone — a friend, a family member, or even in a voice memo to yourself.", reflection: "What would you tell someone just starting this journey?", opener: "If someone asked you today what you've actually learned about discipline this month, what would you say? What would be the most honest, useful thing you could tell them?" },
  { title: "When it gets hard", theme: "Grit", prompt: "This is the part of the month where people quietly stop. Not dramatically. They just drift. Today you decide not to drift.", task: "Do your focus behavior twice today. Not to punish yourself — to prove to yourself that you still choose this.", reflection: "What does 'hard' actually feel like for you — is it physical, mental, emotional?", opener: "What does it feel like in your body and your mind when you're about to quit something? Walk me through what happens — I want to understand your specific pattern." },
  { title: "Gratitude without the fluff", theme: "Perspective", prompt: "Not the Instagram kind. The real kind — being genuinely aware of what you have that makes your growth even possible.", task: "Name one resource, advantage, or person in your life that makes your progress possible and that you take for granted.", reflection: "How would losing that thing change your ability to grow?", opener: "What's something in your life — a resource, a person, a circumstance — that genuinely enables the growth you're doing, that you don't think about enough?" },
  { title: "The person in the mirror", theme: "Integrity", prompt: "Discipline is ultimately about whether you do what you said you'd do when no one is watching. It's between you and you.", task: "Honestly rate your follow-through this month from 1–10. Write what you'd need to do differently to make it one point higher.", reflection: "Are you proud of who you've been this month?", opener: "If you rated your follow-through this month honestly — just between you and yourself — what number would you give it, and why?" },
  { title: "Day 30: You're different now", theme: "Identity", prompt: "You started this as one person. You're finishing it as someone slightly different — someone who chose to show up for 30 days. That matters more than any single habit.", task: "Write the same 3 sentences you wrote on Day 1 — who you're becoming. See what's changed in how you see yourself.", reflection: "What's the most surprising thing you learned about yourself this month?", opener: "You made it. Tell me — what's actually different about you now compared to Day 1? Not what you hoped would be different. What actually is." }
];

const ACCENT = "#E8570A";
const ACCENT_LIGHT = "#FEF0E8";
const OFF_BLACK = "#111110";

export default function BecomeThem() {
  const [screen, setScreen] = useState("onboard"); // onboard | main
  const [identity, setIdentity] = useState("");
  const [currentDay, setCurrentDay] = useState(0);
  const [completedDays, setCompletedDays] = useState(new Array(30).fill(false));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("today"); // today | chat
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  function startJourney() {
    if (!identity.trim()) return;
    setScreen("main");
    setMessages([{ role: "ai", text: DAYS[0].opener }]);
  }

  function goToDay(idx) {
    const d = Math.max(0, Math.min(29, idx));
    setCurrentDay(d);
    setMessages([{ role: "ai", text: DAYS[d].opener }]);
    setInput("");
    setTab("today");
  }

  function markDone() {
    const next = [...completedDays];
    next[currentDay] = !next[currentDay];
    setCompletedDays(next);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", text }];
    setMessages(newMsgs);
    setLoading(true);

    const d = DAYS[currentDay];
    const system = `You are a no-BS discipline coach inside an app called Become Them. The user defined who they're becoming as: "${identity}". They are on Day ${currentDay + 1} of 30. Today's theme is "${d.theme}" — "${d.title}".

Your style: honest, direct, warm but not soft. No motivational poster language. No "you've got this!" fluff. Talk like a real person who genuinely wants to help. Ask sharp follow-up questions. Call out avoidance gently but clearly. Keep replies SHORT — 2-4 sentences max. Make every word count.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system,
          messages: newMsgs.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "Keep going. What happened today?";
      setMessages([...newMsgs, { role: "ai", text: reply }]);
    } catch {
      setMessages([...newMsgs, { role: "ai", text: "What did you actually do today? Tell me." }]);
    }
    setLoading(false);
  }

  const done = completedDays.filter(Boolean).length;
  const day = DAYS[currentDay];
  const isDone = completedDays[currentDay];

  // ONBOARDING
  if (screen === "onboard") {
    return (
      <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: OFF_BLACK, color: "#F5F3EE", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px", maxWidth: 480, margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", color: ACCENT, marginBottom: 16, fontFamily: "system-ui, sans-serif" }}>
          30 days · identity-based discipline
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 400, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: -1 }}>
          Become<br />Them.
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#AAA89E", margin: "0 0 40px", fontFamily: "system-ui, sans-serif", fontWeight: 300 }}>
          Most discipline plans tell you what to do.<br />
          This one starts with who you're becoming.
        </p>

        <div style={{ marginBottom: 12, fontFamily: "system-ui, sans-serif" }}>
          <label style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: 10 }}>
            Describe the version of you that exists in 1 year
          </label>
          <textarea
            value={identity}
            onChange={e => setIdentity(e.target.value)}
            placeholder="Be specific. Not 'a better person' — who exactly are they? What do they do? How do they carry themselves?"
            rows={4}
            style={{ width: "100%", boxSizing: "border-box", background: "#1C1C1A", border: "1px solid #333", borderRadius: 10, padding: "14px 16px", color: "#F5F3EE", fontSize: 14, lineHeight: 1.6, fontFamily: "system-ui, sans-serif", resize: "none", outline: "none" }}
            onFocus={e => e.target.style.borderColor = ACCENT}
            onBlur={e => e.target.style.borderColor = "#333"}
          />
        </div>

        <button
          onClick={startJourney}
          disabled={!identity.trim()}
          style={{ background: identity.trim() ? ACCENT : "#333", color: identity.trim() ? "#fff" : "#666", border: "none", borderRadius: 10, padding: "14px 24px", fontSize: 15, fontFamily: "system-ui, sans-serif", fontWeight: 500, cursor: identity.trim() ? "pointer" : "default", transition: "all 0.2s", letterSpacing: 0.3 }}>
          Start Day 1 →
        </button>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#F8F6F1", minHeight: "100vh", maxWidth: 480, margin: "0 auto", boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ background: OFF_BLACK, padding: "18px 20px 16px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#F5F3EE", letterSpacing: -0.5 }}>
            Become<span style={{ color: ACCENT }}>.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#888" }}>{done}/30</span>
            <div style={{ width: 80, height: 3, background: "#333", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(done / 30) * 100}%`, background: ACCENT, borderRadius: 99, transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        {/* Dot row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 12 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} onClick={() => goToDay(i)} title={`Day ${i + 1}`} style={{ width: 8, height: 8, borderRadius: "50%", cursor: "pointer", background: completedDays[i] ? ACCENT : i === currentDay ? "#666" : "#2A2A28", transition: "background 0.15s" }} />
          ))}
        </div>
      </div>

      <div style={{ padding: "0 0 80px" }}>

        {/* Day nav */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px 0", gap: 12 }}>
          <button onClick={() => goToDay(currentDay - 1)} disabled={currentDay === 0}
            style={{ background: "none", border: "1px solid #ddd", borderRadius: 8, width: 30, height: 30, cursor: currentDay === 0 ? "default" : "pointer", opacity: currentDay === 0 ? 0.3 : 1, fontSize: 14, color: OFF_BLACK, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: ACCENT, marginBottom: 2 }}>
              Day {currentDay + 1} · {day.theme}
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, color: OFF_BLACK, lineHeight: 1.2 }}>
              {day.title}
            </div>
          </div>
          {isDone && <div style={{ fontSize: 11, background: ACCENT_LIGHT, color: ACCENT, padding: "4px 10px", borderRadius: 99, fontWeight: 500 }}>✓ Done</div>}
          <button onClick={() => goToDay(currentDay + 1)} disabled={currentDay === 29}
            style={{ background: "none", border: "1px solid #ddd", borderRadius: 8, width: 30, height: 30, cursor: currentDay === 29 ? "default" : "pointer", opacity: currentDay === 29 ? 0.3 : 1, fontSize: 14, color: OFF_BLACK, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", padding: "14px 20px 0", gap: 4 }}>
          {["today", "chat"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 8, background: tab === t ? OFF_BLACK : "transparent", color: tab === t ? "#fff" : "#888", fontSize: 13, fontFamily: "inherit", cursor: "pointer", fontWeight: tab === t ? 500 : 400, transition: "all 0.15s" }}>
              {t === "today" ? "Today's Work" : "Talk to Coach"}
            </button>
          ))}
        </div>

        {tab === "today" && (
          <div style={{ padding: "20px 20px 0" }}>
            {/* Framing */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", marginBottom: 12, border: "1px solid #EAE8E3" }}>
              <div style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>The frame</div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#444", margin: 0 }}>{day.prompt}</p>
            </div>

            {/* Task */}
            <div style={{ background: OFF_BLACK, borderRadius: 14, padding: "18px 20px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: ACCENT, marginBottom: 10 }}>Today's task</div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#E8E6E1", margin: 0 }}>{day.task}</p>
            </div>

            {/* Reflection */}
            <div style={{ background: ACCENT_LIGHT, borderRadius: 14, padding: "18px 20px", marginBottom: 20, border: `1px solid ${ACCENT}33` }}>
              <div style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: ACCENT, marginBottom: 10 }}>Reflect on this</div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#6B3A1F", margin: 0, fontStyle: "italic" }}>{day.reflection}</p>
            </div>

            <button onClick={markDone} style={{ width: "100%", padding: "13px", borderRadius: 12, border: isDone ? `1.5px solid ${ACCENT}` : "1.5px solid #ddd", background: isDone ? ACCENT : "#fff", color: isDone ? "#fff" : OFF_BLACK, fontSize: 14, fontFamily: "inherit", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
              {isDone ? "✓ Day complete" : "Mark day as complete"}
            </button>

            <button onClick={() => setTab("chat")} style={{ width: "100%", marginTop: 10, padding: "13px", borderRadius: 12, border: "none", background: "transparent", color: "#888", fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>
              Talk through it with your coach →
            </button>
          </div>
        )}

        {tab === "chat" && (
          <div style={{ padding: "16px 20px 0" }}>
            <div ref={chatRef} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, maxHeight: 380, overflowY: "auto" }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  maxWidth: "85%",
                  alignSelf: m.role === "ai" ? "flex-start" : "flex-end",
                  background: m.role === "ai" ? "#fff" : OFF_BLACK,
                  color: m.role === "ai" ? OFF_BLACK : "#F5F3EE",
                  border: m.role === "ai" ? "1px solid #EAE8E3" : "none",
                  borderRadius: 14,
                  borderBottomLeftRadius: m.role === "ai" ? 4 : 14,
                  borderBottomRightRadius: m.role === "user" ? 4 : 14,
                  padding: "10px 14px",
                  fontSize: 14,
                  lineHeight: 1.6
                }}>
                  <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.5px", opacity: 0.5, marginBottom: 4 }}>
                    {m.role === "ai" ? "Coach" : "You"}
                  </div>
                  {m.text}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: "flex-start", background: "#fff", border: "1px solid #EAE8E3", borderRadius: 14, borderBottomLeftRadius: 4, padding: "12px 14px", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#bbb", animation: `bt 1.2s ${i * 200}ms infinite` }} />
                  ))}
                  <style>{`@keyframes bt{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Be honest. That's all."
                rows={1}
                style={{ flex: 1, fontFamily: "inherit", fontSize: 14, padding: "10px 14px", borderRadius: 12, border: "1.5px solid #ddd", background: "#fff", color: OFF_BLACK, resize: "none", outline: "none", minHeight: 44, lineHeight: 1.5, transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = ACCENT}
                onBlur={e => e.target.style.borderColor = "#ddd"}
              />
              <button onClick={handleSend} disabled={loading || !input.trim()} style={{ background: input.trim() && !loading ? OFF_BLACK : "#ddd", color: input.trim() && !loading ? "#fff" : "#aaa", border: "none", borderRadius: 12, width: 44, height: 44, fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "default", flexShrink: 0, transition: "all 0.15s" }}>
                ↑
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
