import { FormEvent, useRef } from "react";

type NewGoalProps = {
  onAddGoal: (title: string, summary: string) => void;
}

export default function NewGoal({ onAddGoal }: NewGoalProps) {

  const goal = useRef<HTMLInputElement>(null);
  const summary = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const enteredGoal = goal.current!.value;
    const enteredSummary = summary.current!.value;

    event.currentTarget.reset();
    onAddGoal(enteredGoal, enteredSummary);

  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="goals"></label>
        <input type="text" id="goal" ref={goal} />
      </p>
      <p>
        <label htmlFor="summary"></label>
        <input type="text" id="summary" ref={summary} />
      </p>
      <button>Add</button>
    </form>
  )
}