import React, { useState } from 'react';
import './App.css';
import foodData from './utils/data.json';

// Define types for the food data and selected food
interface Food {
  name: string;
  caloriesPerUnit: number;
  unit: string;
}

interface SelectedFood {
  name: string;
  quantity: number;
}

interface FoodData {
  foods: Food[];
  basalCalories: {
    weightGainFactor: number;
    weightLossFactor: number;
  };
  exerciseCalories: {
    pushUp: number;
  };
}

const App: React.FC = () => {
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [calorieIntake, setCalorieIntake] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [exerciseDuration, setExerciseDuration] = useState<number>(0); // in minutes
  const [goal, setGoal] = useState<'gain' | 'lose'>('gain'); // weight gain or loss

  const calculateCalories = (): { totalCalories: number; dailyCaloriesNeeded: number } => {
    let totalCalories = 0;
    selectedFoods.forEach((food) => {
      const foodItem = (foodData as FoodData).foods.find((item) => item.name === food.name);
      if (foodItem) {
        totalCalories += (foodItem.caloriesPerUnit * food.quantity) / 100;
      }
    });

    setCalorieIntake(totalCalories);

    // Calculate Basal Metabolic Rate (BMR)
    const bmr = 10 * weight + 6.25 * height - 5 * 30 + 5; // Mifflin-St Jeor Equation for male
    const activityMultiplier = goal === 'gain' ? (foodData as FoodData).basalCalories.weightGainFactor : (foodData as FoodData).basalCalories.weightLossFactor;
    const dailyCaloriesNeeded = bmr * activityMultiplier;

    return { totalCalories, dailyCaloriesNeeded };
  };

  const calculateExerciseBurn = (): number => {
    // Assume push-up, squat, running in minutes as input for now
    const burn = exerciseDuration * (foodData as FoodData).exerciseCalories.pushUp; // example exercise
    return burn;
  };

  const handleFoodSelection = (foodName: string, quantity: string): void => {
    const parsedQuantity = parseFloat(quantity);
    if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
      setSelectedFoods((prevFoods) => {
        const existingFood = prevFoods.find((food) => food.name === foodName);
        if (existingFood) {
          return prevFoods.map((food) =>
            food.name === foodName ? { ...food, quantity: parsedQuantity } : food
          );
        }
        return [...prevFoods, { name: foodName, quantity: parsedQuantity }];
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
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
          {(foodData as FoodData).foods.map((food) => (
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
          <select value={goal} onChange={(e) => setGoal(e.target.value as 'gain' | 'lose')}>
            <option value="gain">Gain Weight</option>
            <option value="lose">Lose Weight</option>
          </select>
        </div>

        <div className="body-stats">
          <label>Weight (kg):</label>
          <input type="number" onChange={(e) => setWeight(parseFloat(e.target.value))} />

          <label>Height (cm):</label>
          <input type="number" onChange={(e) => setHeight(parseFloat(e.target.value))} />
        </div>

        <div className="exercise-stats">
          <label>Exercise Duration (minutes):</label>
          <input type="number" onChange={(e) => setExerciseDuration(parseFloat(e.target.value))} />
        </div>

        <button type="submit">Calculate</button>
      </form>
    </div>
  );
};

export default App;
