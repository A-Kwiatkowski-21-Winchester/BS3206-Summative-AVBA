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
  fireEvent.change(heightInput, { target: { value: '150' } });
  fireEvent.change(weightInput, { target: { value: '45' } });

  // Enter date of birth
  const dayInput = screen.getByLabelText('Day');
  const monthInput = screen.getByLabelText('Month');
  const yearInput = screen.getByLabelText('Year');
  fireEvent.change(dayInput, { target: { value: '15' } });
  fireEvent.change(monthInput, { target: { value: '6' } });
  fireEvent.change(yearInput, { target: { value: '2010' } });


  // Check BMI calculation and category
  expect(screen.getByText('Your BMI is: 20.0')).toBeInTheDocument();
  expect(screen.getByText('Your weight is between the 2nd and 91st centiles')).toBeInTheDocument();

  // Check if the save and reload buttons are present
  const saveButton = screen.getByText('Save');
  const reloadButton = screen.getByText('Reload');
  expect(saveButton).toBeInTheDocument();
  expect(reloadButton).toBeInTheDocument();

  // Simulate clicking the reload button to reset fields
  fireEvent.click(reloadButton);
  expect(heightInput.value).toBe('');
  expect(weightInput.value).toBe('');
  expect(dayInput.value).toBe('');
  expect(monthInput.value).toBe('');
  expect(yearInput.value).toBe('');
});
