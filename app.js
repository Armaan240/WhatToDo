document.addEventListener("DOMContentLoaded",()=> {
const storedTasks = JSON.parse(localStorage.getItem("tasks"))

 if(storedTasks){
    storedTasks.forEach((task)=> tasks.push(task))
    updateTaskList();
    updateStats();
 }
})

let tasks = [];  // Changed variable name to plural for clarity
const saveTasks = () =>{
    localStorage.setItem('tasks',JSON.stringify(tasks))
}
const addTask = () => {
    const taskInput = document.getElementById('taskInput'); // Fixed selector
    const text = taskInput.value.trim(); // Fixed property name (was ariaValueMax)

    if(text) {
        tasks.push({
            text: text, 
            completed: false
        });
        taskInput.value = ''; // Clear input after adding
        updateTaskList();
        updateStats();
        saveTasks()
    }
    
};




const updateTaskList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = "";

    tasks.forEach((task, index) => { // Fixed syntax error in forEach
        const listItem = document.createElement("li");

        listItem.innerHTML = `
       <div class="taskItem">
  <div class="task ${task.completed ? 'completed' : ''}">
    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
    <p>${task.text}</p>
  </div>
  <div class="icons">
    <span onclick="editTask(${index})">✏️</span>  <!-- Emoji replace PNG -->
    <span onclick="deleteTask(${index})">🗑️</span>
  </div>  
</div>
        `;
        
        // Add event listener to checkbox
        listItem.querySelector('.checkbox').addEventListener('change', () => toggleTaskComplete(index));
        taskList.append(listItem);
    });
};

// Toggle task completion status
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStats();
    saveTasks()
};

// Delete task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks()
};

// Edit task (basic implementation)
const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
   taskInput.value = tasks[index].text;

   tasks.splice(index,1);
   updateTaskList();
   updateStats();
   saveTasks()
};
const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completeTasks/totalTasks)*100 : 0;
    
    // Update progress bar
    document.getElementById('progress').style.width = `${progress}%`;
    
    // Update numbers display
    document.getElementById('numbers').textContent = `${completeTasks}/${totalTasks}`;
    
    // Emoji Mood Meter
    const emojis = ['😴', '😔', '😐', '🙂', '😎'];
    const messages = [
        "Let's get started!", 
        "You can do this!", 
        "Halfway there!", 
        "Almost done!", 
        "You're crushing it!"
    ];
    const moodIndex = Math.min(Math.floor(progress / 20), 4);
    document.querySelector('.emoji').textContent = emojis[moodIndex];
    document.querySelector('.progress-text').textContent = messages[moodIndex];
    
    // Step Progress
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.toggle('active', stepNum <= Math.ceil(progress / 25));
    });
    
    // Confetti on 100% completion
    if (progress === 100 && completeTasks > 0) {
        new JSConfetti().addConfetti({
            emojis: ['✅', '🎉', '✨', '🏆'],
            emojiSize: 25,
            confettiNumber: 30
        });
    }
};

// Event listener for form submission
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    addTask();
});
document.getElementById('newTask').addEventListener('click',function(g){
g.preventDefault();
    addTask();
});

