//import { useState } from "react"

export default function TaskListing() {
    //const [tasks, setTasks] = useState([])    
    const tasks = [
        { hours: 1.4, task: "Buy groceries" },
        { hours: 4.5, task: "Finish project" },
        { hours: 2.0, task: "Call Mom" },
        { hours: 8.0, task: "Read a book" },
    ];

    return (
        <div>
            <div className="flex gap-2 mt-2">
                <div className="flex-1 aspect-square border-1 border-gray-300">
                    <p className="text-left p-2">Jake</p>
                    {/* <p className="border-gray-300 border text-sm ml-1 mr-1">Task one</p> */}
                </div>
                <div className="flex-1 aspect-square border-1 border-gray-300">
                    <p className="text-left p-2">Paul</p>
                </div>
                <div className="flex-1 aspect-square border-1 border-gray-300">
                    <p className="text-left p-2">Matt</p>
                </div>
                <div className="flex-1 aspect-square border-1 border-gray-300">
                    <p className="text-left p-2">Kate</p>
                </div>
            </div>
        </div>
    )
}