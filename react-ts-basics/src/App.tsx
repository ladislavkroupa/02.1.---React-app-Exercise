/*import goalsImg from "./assets/goals.jpg"

import Header from "./components/GoalApp/Header.tsx"
import CourseGoalsList from "./components/GoalApp/CourseGoalList.tsx"
import { useState } from "react"
import NewGoal from "./components/GoalApp/NewGoal.tsx"
*/

import RoutingComponent from "./components/LoginApp/WelcomePage/RoutingComponent";
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './style.css';

export type CourseGoal = {
  id: number;
  title: string;
  description: string;
}
/*
export default function App() {

  const [goals, setGoals] = useState<CourseGoal[]>([]);

  function handleOnDelete(id: number) {
    setGoals(prevGoals => {
      return prevGoals.filter(goal => goal.id !== id)
    }
    );
  }

  function handleAddGoals(goal: string, summary: string) {
    setGoals(prevGoals => {
      let newGoal: CourseGoal = {
        id: Math.floor(Math.random() * 1000 + 1),
        title: goal,
        description: summary
      }
      return [...prevGoals, newGoal]
    }
    )
  }


  return (
    <main>
      <Header image={{
        src: goalsImg,
        alt: "Alter of image goals."
      }} >
        <h1>Your Course Goals</h1>
      </Header >
      <NewGoal onAddGoal={handleAddGoals} />
      <CourseGoalsList goals={goals} onDelete={handleOnDelete} />
    </main>
  )
}
*/

export default function App() {
  return (
    <div className="container mx-auto px-4">
      <Router>
        <RoutingComponent />
      </Router>
    </div>
  )
}