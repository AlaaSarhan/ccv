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
  const [otherParentDays, setOtherParentDays] = useState([]);

  useEffect(() => {
    if (otherParentDays.legnth) {
      return
    }

    const storedOtherParentDays = JSON.parse(localStorage.getItem('otherParentDays'));
   
    setOtherParentDays(storedOtherParentDays.length ? storedOtherParentDays : [ [], [], [], [], [], [], [], [] ]);
  }, []);

  useEffect(() => {
    if (!otherParentDays.length) {
      return;
    }

    console.log('storing', otherParentDays)
    localStorage.setItem('otherParentDays', JSON.stringify(otherParentDays));
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

  const set = useCallback(() => {
    const value = JSON.parse(window.prompt("Enter json value you have copied/saved.", '[ [], [], [], [] ]'));

    if (!value) {
      window.alert('Invalid value');
      return;
    }

    setOtherParentDays(value);

  })

  const toggleDay = useCallback((weekIdx, dayIdx) => {
    const newOtherParentsDays = [...otherParentDays];
    newOtherParentsDays[weekIdx] = [...(otherParentDays[weekIdx] || [])];
    const oldValue = newOtherParentsDays[weekIdx][dayIdx];
    let newValue;
    switch (oldValue) {
      case 1:
        newValue = 0;
        break;
      case 0.5:
        newValue = 1;
        break;
      default:
        newValue = 0.5;
        break;
    }
    newOtherParentsDays[weekIdx][dayIdx] = newValue;
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

  const totalDays = otherParentDays.length * 7.0;
  const otherParentShare = (otherParentDays.reduce((sum, week) => sum + week.reduce((sum, day) => sum + day || 0, 0), 0) / totalDays);
  const parentShare = 1 - otherParentShare;

  const totalEvenWeekendDays = Math.floor(otherParentDays.length / 2) * 2;
  const otherParentEvenWeekendShare = (otherParentDays.filter((_, weekIdx) => (weekIdx + 1) % 2 == 0).reduce((sum, week) => sum + week.filter((_, dayIdx) => dayIdx > 4).reduce((sum, day) => sum + day, 0), 0)) / totalEvenWeekendDays;
  const parentEvenWeekendShare = 1 - otherParentEvenWeekendShare;
  
  const totalOddWeekendDays = Math.ceil(otherParentDays.length / 2) * 2;
  const otherParentOddWeekendShare = (otherParentDays.filter((_, weekIdx) => weekIdx % 2 == 0).reduce((sum, week) => sum + week.filter((_, dayIdx) => dayIdx > 4).reduce((sum, day) => sum + day, 0), 0)) / totalEvenWeekendDays;
  const parentOddWeekendShare = 1 - otherParentOddWeekendShare;


  return (
    <>
      <div className='cp'>
        <center>
          <div className='cp-value'>
            <h2>Current value</h2>
            <p>you can copy and save this value, and use the 'Set' button above to reset to it</p>
            <form>
              <input readonly={true} value={JSON.stringify(otherParentDays)} />
            </form>
          </div>

          <div className='cp-buttons'>
            <button onClick={reset}>Reset</button>
            <button onClick={set}>Set</button>
          </div>
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
                <td className={'weekday-cell mon-cell ' + (week[0] > 0 && `other-parent-cell-${week[0]}`)} onClick={() => toggleDay(idx, 0)}></td>
                <td className={'weekday-cell tue-cell ' + (week[1] > 0 && `other-parent-cell-${week[1]}`)} onClick={() => toggleDay(idx, 1)}></td>
                <td className={'weekday-cell wed-cell ' + (week[2] > 0 && `other-parent-cell-${week[2]}`)} onClick={() => toggleDay(idx, 2)}></td>
                <td className={'weekday-cell thu-cell ' + (week[3] > 0 && `other-parent-cell-${week[3]}`)} onClick={() => toggleDay(idx, 3)}></td>
                <td className={'weekday-cell fri-cell ' + (week[4] > 0 && `other-parent-cell-${week[4]}`)} onClick={() => toggleDay(idx, 4)}></td>
                <td className={'weekend-cell sat-cell ' + (week[5] > 0 && `other-parent-cell-${week[5]}`)} onClick={() => toggleDay(idx, 5)}></td>
                <td className={'weekend-cell sun-cell ' + (week[6] > 0 && `other-parent-cell-${week[6]}`)} onClick={() => toggleDay(idx, 6)}></td>
              </tr>))
            }
          </tbody>
        </table>
      </div>
     <div>
        <h2>Stats</h2>

        <center>
        <table>
          <thead>
            <tr>
              <td></td>
              <td>Total time share</td>
              <td>Even weekends time share</td>
              <td>Odd weekends time share</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>First parent</td>
              <td>{Math.round(parentShare * 100)}%</td>
              <td>{Math.round(parentEvenWeekendShare * 100)}%</td>
              <td>{Math.round(parentOddWeekendShare * 100)}%</td>
            </tr>
            <tr style={{ backgroundColor: '#333' }}>
              <td>Other parent (Shaded)</td>
              <td>{Math.round(otherParentShare * 100)}%</td>
              <td>{Math.round(otherParentEvenWeekendShare * 100)}%</td>
              <td>{Math.round(otherParentOddWeekendShare * 100)}%</td>
            </tr>
          </tbody>
        </table>
        </center>
      </div>
    </>
  )
}

export default App
