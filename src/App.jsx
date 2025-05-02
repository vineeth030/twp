import './App.css'
import TaskForm from '@/components/task-form'
import TaskListing from '@/components/tesk-listing'

function App() {
  return (
    <>
      <main className="container mx-auto p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Task Manager</h2>
        <TaskForm />
        <TaskListing />
      </main>
    </>
  )
}

export default App
