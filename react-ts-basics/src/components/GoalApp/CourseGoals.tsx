
type CourseGoalsProps = {
  id: number;
  title: string;
  description: string;
  onDelete: (id: number) => void;
}

export default function CourseGoals({ id, title, description, onDelete }: CourseGoalsProps) {
  return (
    <article>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button onClick={() => { onDelete(id) }}>Delete</button>
    </article>
  )
}