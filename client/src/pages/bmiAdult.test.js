import React from 'react';
import {test, expect} from "@jest/globals"
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import '@testing-library/jest-dom/extend-expect';
import BmiAdults from './bmiAdults';

test('renders BmiAdults component correctly and verifies inputs and calculations', () => {
  render(
    <BrowserRouter>
      <BmiAdults />
    </BrowserRouter>
  );

  // Check if the main header is rendered
  expect(screen.getByText('Calculate your BMI for adults')).toBeInTheDocument();

  // Check if the link to go back is rendered
  const goBackLink = screen.getByText('Go back');
  expect(goBackLink).toBeInTheDocument();
  expect(goBackLink.closest('a')).toHaveAttribute('href', '/bmitest');

  // Check if the weight system buttons are rendered and click the metric button
  const metricButton = screen.getByText('Metric (kg, cm)');
  const imperialButton = screen.getByText('Imperial (lbs, ft)');
  expect(metricButton).toBeInTheDocument();
  expect(imperialButton).toBeInTheDocument();

  fireEvent.click(metricButton);
  expect(metricButton).not.toHaveClass('inactive');
  expect(imperialButton).toHaveClass('inactive');

  // Enter height and weight in metric system
  const heightInput = screen.getByLabelText('Height (cm):');
  const weightInput = screen.getByLabelText('Weight (kg):');
  fireEvent.change(heightInput, { target: { value: '180' } });
  fireEvent.change(weightInput, { target: { value: '90' } });

  // Enter date of birth
  const dayInput = screen.getByLabelText('Day');
  const monthInput = screen.getByLabelText('Month');
  const yearInput = screen.getByLabelText('Year');
  fireEvent.change(dayInput, { target: { value: '12' } });
  fireEvent.change(monthInput, { target: { value: '12' } });
  fireEvent.change(yearInput, { target: { value: '2003' } });


  // Check BMI calculation and category
  expect(screen.getByText('Your BMI is: 27.8')).toBeInTheDocument();
  expect(screen.getByText('According to your BMI, you are overweight. Consider seeking weight-management guidance from a healthcare specialist.')).toBeInTheDocument();

  fireEvent.click(imperialButton);
  expect(imperialButton).not.toHaveClass('inactive');
  expect(metricButton).toHaveClass('inactive');

  const heightInputFeet = screen.getByLabelText('Height (ft):');
  const heightInputInches = screen.getByLabelText('Height (in):');
  const weightInputPound = screen.getByLabelText('Weight (lbs):');
  fireEvent.change(heightInputFeet, { target: { value: '5' } });
  fireEvent.change(heightInputInches, { target: { value: '11' } });
  fireEvent.change(weightInputPound, { target: { value: '180' } });

  fireEvent.change(dayInput, { target: { value: '15' } });
  fireEvent.change(monthInput, { target: { value: '6' } });
  fireEvent.change(yearInput, { target: { value: '2000' } });

  // Check BMI calculation and category
  expect(screen.getByText('Your BMI is: 25.1')).toBeInTheDocument();
  expect(screen.getByText('According to your BMI, you are overweight. Consider seeking weight-management guidance from a healthcare specialist.')).toBeInTheDocument();

  // Age verification for under 18
  fireEvent.change(yearInput, { target: { value: '2010' } });
  fireEvent.blur(yearInput); // Trigger age check
  expect(screen.getByText('You should use the child and teen BMI calculator.')).toBeInTheDocument();


  // Check if the save and reload buttons are present
  const saveButton = screen.getByText('Save');
  const reloadButton = screen.getByText('Reload');
  expect(saveButton).toBeInTheDocument();
  expect(reloadButton).toBeInTheDocument();

  // Simulate clicking the reload button to reset weight and height fields
  fireEvent.click(reloadButton);
  expect(heightInput.value).toBe('');
  expect(weightInput.value).toBe('');
});


