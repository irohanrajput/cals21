import React, { useState, useEffect } from 'react';
import './App.css';
import foodData from './data.json';

const App = () => {
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [calorieIntake, setCalorieIntake] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [exerciseDuration, setExerciseDuration] = useState(0); // in minutes
  const [goal, setGoal] = useState('gain'); // weight gain or loss

  const calculateCalories = () => {
    let totalCalories = 0;
    selectedFoods.forEach(food => {
      totalCalories += (foodData.foods.find(item => item.name === food.name).caloriesPerUnit * food.quantity) / 100;
    });

    setCalorieIntake(totalCalories);

    // Calculate Basal Metabolic Rate (BMR)
    const bmr = 10 * weight + 6.25 * height - 5 * 30 + 5; // Mifflin-St Jeor Equation for male
    const activityMultiplier = goal === 'gain' ? foodData.basalCalories.weightGainFactor : foodData.basalCalories.weightLossFactor;
    const dailyCaloriesNeeded = bmr * activityMultiplier;

    return { totalCalories, dailyCaloriesNeeded };
  };

  const calculateExerciseBurn = () => {
    // Assume push-up, squat, running in minutes as input for now
    let burn = 0;
    burn += (exerciseDuration * foodData.exerciseCalories.pushUp); // example exercise
    return burn;
  };

  const handleFoodSelection = (foodName, quantity) => {
    setSelectedFoods(prevFoods => [...prevFoods, { name: foodName, quantity }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { totalCalories, dailyCaloriesNeeded } = calculateCalories();
    const exerciseBurn = calculateExerciseBurn();
    alert(`Total Calories: ${totalCalories}\nCalories Needed: ${dailyCaloriesNeeded}\nExercise Burn: ${exerciseBurn}`);
  };

  return (
    <div className="App">
      <h1>Calorie Calculator</h1>
      <form onSubmit={handleSubmit}>
        <div className="food-selection">
          <h2>Food Selection</h2>
          {foodData.foods.map(food => (
            <div key={food.name}>
              <label>{food.name} ({food.unit})</label>
              <input 
                type="number" 
                onChange={(e) => handleFoodSelection(food.name, e.target.value)} 
                placeholder="Quantity"
              />
            </div>
          ))}
        </div>

        <div className="goal-selection">
          <label>Goal:</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="gain">Gain Weight</option>
            <option value="lose">Lose Weight</option>
          </select>
        </div>

        <div className="body-stats">
          <label>Weight (kg):</label>
          <input type="number" onChange={(e) => setWeight(e.target.value)} />

          <label>Height (cm):</label>
          <input type="number" onChange={(e) => setHeight(e.target.value)} />
        </div>

        <div className="exercise-stats">
          <label>Exercise Duration (minutes):</label>
          <input type="number" onChange={(e) => setExerciseDuration(e.target.value)} />
        </div>

        <button type="submit">Calculate</button>
      </form>
    </div>
  );
};

export default App;
