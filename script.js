document.addEventListener("DOMContentLoaded", () => {
  let points = parseInt(localStorage.getItem("points")) || 0;
  let dailyPoints = parseInt(localStorage.getItem("dailyPoints")) || 0;
  let weeklyPoints = parseInt(localStorage.getItem("weeklyPoints")) || 0;

  // Goals
  const dailyGoal = 100;
  const weeklyGoal = 500;

  // DOM elements
  const taskType = document.getElementById("taskType");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const pointsDisplay = document.getElementById("points");
  const levelDisplay = document.getElementById("level");
  const progressBar = document.getElementById("progress");
  const dailyGoalDisplay = document.getElementById("dailyGoalDisplay");
  const weeklyGoalDisplay = document.getElementById("weeklyGoalDisplay");

  // Set goal displays
  dailyGoalDisplay.textContent = dailyGoal;
  weeklyGoalDisplay.textContent = weeklyGoal;

  // Add task functionality
  addTaskBtn.addEventListener("click", () => {
    const task = taskType.value;
    let taskText = "";
    let taskPoints = 0;

    if (task === "email") {
      taskText = "Send Cold Email";
      taskPoints = 1;
    } else if (task === "call") {
      taskText = "Make Cold Call";
      taskPoints = 3;
    } else if (task === "demo") {
      taskText = "Schedule Demo";
      taskPoints = 10;
    }

    if (taskText) {
      const taskItem = document.createElement("li");
      taskItem.textContent = `${taskText} (${taskPoints} points)`;

      // Complete task button
      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Complete";
      completeBtn.addEventListener("click", () => {
        if (!taskItem.classList.contains("completed")) {
          taskItem.classList.add("completed");

          // Update points
          points += taskPoints;
          dailyPoints += taskPoints;
          weeklyPoints += taskPoints;

          // Save to local storage
          localStorage.setItem("points", points);
          localStorage.setItem("dailyPoints", dailyPoints);
          localStorage.setItem("weeklyPoints", weeklyPoints);

          updateScoreboard();
          updateGoals();
        }
      });

      // Remove task button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        taskList.removeChild(taskItem);
      });

      taskItem.appendChild(completeBtn);
      taskItem.appendChild(removeBtn);
      taskList.appendChild(taskItem);
    }
  });

  // Update scoreboard
  const updateScoreboard = () => {
    pointsDisplay.textContent = points;

    // Update level
    if (points < 30) {
      levelDisplay.textContent = "Rookie";
    } else if (points < 70) {
      levelDisplay.textContent = "Pro";
    } else {
      levelDisplay.textContent = "Sales Champion";
    }

    // Update progress bar
    const progress = Math.min((dailyPoints / dailyGoal) * 100, 100);
    progressBar.style.width = `${progress}%`;

    // Congratulate on daily goal (but don’t reset progress)
    if (dailyPoints >= dailyGoal && !localStorage.getItem("dailyGoalReached")) {
      alert(`🎉 Congratulations! You hit your daily goal of ${dailyGoal} points! 🎉`);
      localStorage.setItem("dailyGoalReached", true);
    }
  };

  // Update daily and weekly goals
  const updateGoals = () => {
    // Display progress in the console for debugging
    console.log(`Daily Points: ${dailyPoints}, Weekly Points: ${weeklyPoints}`);

    // Congratulate on weekly goal
    if (weeklyPoints >= weeklyGoal && !localStorage.getItem("weeklyGoalReached")) {
      alert("🎉 You hit your weekly goal! Keep crushing it!");
      localStorage.setItem("weeklyGoalReached", true);
    }
  };

  // Reset daily points at midnight
  const resetDailyProgress = () => {
    const now = new Date();
    const timeToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

    setTimeout(() => {
      dailyPoints = 0;
      localStorage.setItem("dailyPoints", 0);
      localStorage.removeItem("dailyGoalReached");
      progressBar.style.width = "0%"; // Reset progress bar
      updateScoreboard();
      resetDailyProgress(); // Schedule the next reset
    }, timeToMidnight);
  };

  // Initialize reset schedule
  resetDailyProgress();

  // Load persisted progress
  updateScoreboard();
  updateGoals();
});
