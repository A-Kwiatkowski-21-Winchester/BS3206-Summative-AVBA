import React from 'react';

// Component for displaying BMI message for Underweight category
const UnderweightMessage = () => (
  <div className="bmi-card">
    <h4>Underweight</h4>
    <p>You are underweight. Please consult with a healthcare professional.</p>
  </div>
);

// Component for displaying BMI message for Normal category
const NormalMessage = () => (
  <div className="bmi-card">
    <h4>Normal</h4>
    <p>You have a normal BMI. Keep up the good work!</p>
  </div>
);

// Component for displaying BMI message for Overweight category
const OverweightMessage = () => (
  <div className="bmi-card">
    <h4>Overweight</h4>
    <p>You are overweight. Consider making healthy lifestyle changes.</p>
  </div>
);

// Component for displaying BMI message for Obese category
const ObeseMessage = () => (
  <div className="bmi-card">
    <h4>Obese</h4>
    <p>You are obese. Seek guidance from a healthcare provider for weight management.</p>
  </div>
);

// Main BMI component to render appropriate message based on BMI value
const bmiCard = ({ bmi }) => {
  let messageComponent;

  if (bmi < 18.5) {
    messageComponent = <UnderweightMessage />;
  } else if (bmi >= 18.5 && bmi < 25) {
    messageComponent = <NormalMessage />;
  } else if (bmi >= 25 && bmi < 30) {
    messageComponent = <OverweightMessage />;
  } else {
    messageComponent = <ObeseMessage />;
  }

  return (
    <div className="bmi-cards">
      {messageComponent}
    </div>
  );
};

export default bmiCard;
