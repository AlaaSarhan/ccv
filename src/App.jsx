import { useEffect, useState, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const flipPattern = (pattern) => {
  return pattern.map(week => {
    const flipped = []
    for (let i = 0; i < 7; i++) {
      flipped[i] = 1 - (week[i] || 0)
    }
    return flipped;
  })
}

function App() {
  const [otherParentDays, setOtherParentDays] = useState(
    JSON.parse(localStorage.getItem('otherParentDays')) || [ [], [], [], [], [], [], [], [], [], [], [], [] ]
  );

  useEffect(() => {
    const storedOtherParentDays = JSON.parse(localStorage.getItem('otherParentDays'));
    
    if (storedOtherParentDays) {
      setOtherParentDays(storedOtherParentDays);
      console.log('loaded');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('otherParentDays', JSON.stringify(otherParentDays));
    console.log('saved');
  }, [otherParentDays]);

  const reset = useCallback(() => {
    const nrOfWeeks = Number(window.prompt("How many weeks?", 12));

    if (isNaN(nrOfWeeks)) {
      return;
    }

    const newOtherParentsDays = []
    for (let i = 0; i < nrOfWeeks; i++) {
      newOtherParentsDays[i] = [];
    }

    setOtherParentDays(newOtherParentsDays);
  }, []);

  const toggleDay = useCallback((weekIdx, dayIdx) => {
    const newOtherParentsDays = [...otherParentDays];
    newOtherParentsDays[weekIdx] = [...(otherParentDays[weekIdx] || [])];
    newOtherParentsDays[weekIdx][dayIdx] = newOtherParentsDays[weekIdx][dayIdx] == 1 ? 0 : 1;
    setOtherParentDays(newOtherParentsDays);
  }, [otherParentDays]);

  const repeatPattern = useCallback((weekIdx) => {
    const answer = window.prompt(`Repeat pattern of weeks 1 until ${weekIdx + 1}, same or flip?`, 'same');

    if (!answer) {
      return;
    }

    const flip = answer == 'flip'

    const pattern = otherParentDays.slice(0, weekIdx + 1);
    const next = flip ? flipPattern(pattern) : [...pattern];

    setOtherParentDays([
      ...pattern,
      ...next,
      ...pattern,
      ...next,
    ])

  }, [otherParentDays])

  const totalShare = otherParentDays.length * 7.0;
  const otherParentShare = (otherParentDays.reduce((sum, week) => sum + week.filter(Boolean).length, 0) / totalShare);
  const parentShare = 1 - otherParentShare;

  return (
    <>
      <div>
        <center>
          <button onClick={reset}>Reset</button>
        </center>
      </div>
      <div>
        <h2>Weeks view</h2>
        <table width="100%">
          <thead>
            <tr>
              <td className="week-no-cell">Week</td>
              <td className="weekday-cell mon-cell">Mon</td>
              <td className="weekday-cell tue-cell">Tue</td>
              <td className="weekday-cell wed-cell">Wed</td>
              <td className="weekday-cell thu-cell">Thu</td>
              <td className="weekday-cell fri-cell">Fri</td>
              <td className="weekend-cell sat-cell">Sat</td>
              <td className="weekend-cell sun-cell">Sun</td>
            </tr>
          </thead>
          <tbody>
            {
              otherParentDays.map((week, idx) => (<tr key={`week-no-${idx+1}`} className={`week-${(idx+1) % 2 == 0 ? 'even' : 'odd'}`}>
                <td className="week-no-cell" onClick={() => repeatPattern(idx)}>{idx + 1}</td>
                <td className={`weekday-cell mon-cell ${week[0] && 'other-parent-cell'}`} onClick={() => toggleDay(idx, 0)}></td>
                <td className={`weekday-cell tue-cell ${week[1] && 'other-parent-cell'}`} onClick={() => toggleDay(idx, 1)}></td>
                <td className={`weekday-cell wed-cell ${week[2] && 'other-parent-cell'}`} onClick={() => toggleDay(idx, 2)}></td>
                <td className={`weekday-cell thu-cell ${week[3] && 'other-parent-cell'}`} onClick={() => toggleDay(idx, 3)}></td>
                <td className={`weekday-cell fri-cell ${week[4] && 'other-parent-cell'}`} onClick={() => toggleDay(idx, 4)}></td>
                <td className={`weekend-cell sat-cell ${week[5] && 'other-parent-cell'}`} onClick={() => toggleDay(idx, 5)}></td>
                <td className={`weekend-cell sun-cell ${week[6] && 'other-parent-cell'}`} onClick={() => toggleDay(idx, 6)}></td>
              </tr>))
            }
          </tbody>
        </table>
      </div>
     <div>
        <h2>Stats</h2>

        <div>
          <h3>Time share</h3>
          <p>First parent time share: {Math.round(parentShare * 100)}%</p>
          <p>Second parent time share: {Math.round(otherParentShare * 100)}%</p>
        </div>
        
      </div>
    </>
  )
}

export default App
