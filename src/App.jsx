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
  const [otherParentDays, setOtherParentDays] = useState([
    [], [], [], [], [], [], [], [], [], [], [], [],
  ]);

  useEffect(() => {
    console.log("saving pattern");
  }, [otherParentDays]);

  const toggleDay = useCallback((weekIdx, dayIdx) => {
    const newOtherParentsDays = [...otherParentDays];
    newOtherParentsDays[weekIdx] = [...(otherParentDays[weekIdx] || [])];
    newOtherParentsDays[weekIdx][dayIdx] = newOtherParentsDays[weekIdx][dayIdx] == 1 ? 0 : 1;
    setOtherParentDays(newOtherParentsDays);
  }, [otherParentDays]);

  const repeatPattern = useCallback((weekIdx) => {
    const answer = window.prompt(`Repeat pattern of weeks before ${weekIdx + 1}, same or flip?`, 'same');

    if (!answer) {
      return;
    }

    const flip = answer == 'flip'

    const pattern = otherParentDays.slice(0, weekIdx);
    const next = flip ? flipPattern(pattern) : [...pattern];

    setOtherParentDays([
      ...pattern,
      ...next,
      ...pattern,
      ...next,
    ])

  }, [otherParentDays])

  return (
    <>
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
        <h2>Contiguous days view</h2>

      </div>
      <div>
        <h2>stats</h2>

      </div>
    </>
  )
}

export default App
