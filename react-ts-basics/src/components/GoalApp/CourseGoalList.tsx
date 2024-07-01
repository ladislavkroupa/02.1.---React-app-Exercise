import CourseGoals from "./CourseGoals.tsx"
import { type CourseGoal as CGoal } from "../../App.tsx"

type CourseGoalsListProps = {
  goals: CGoal[]
  onDelete: (id: number) => void;
}


export default function CourseGoalsList({ goals, onDelete }: CourseGoalsListProps) {
  return (
    <ul>
      {goals.map((goal) => (
        <li><CourseGoals id={goal.id} title={goal.title} description={goal.description} onDelete={onDelete} /></li>
      ))}
    </ul>
  )
}