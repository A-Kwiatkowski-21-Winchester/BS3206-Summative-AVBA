import React from 'react';
import {test, expect} from "@jest/globals"
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Bmi from './bmiHome';

test('renders BMI page correctly', () => {
  render(
    <BrowserRouter>
      <Bmi />
    </BrowserRouter>
  );

  // Check if the main header is rendered
  expect(screen.getByText('Calculate your body mass index (BMI)')).toBeInTheDocument();

  // Check if the description paragraph is rendered
  expect(screen.getByText("Check your BMI to find out if you're a healthy weight for your height.")).toBeInTheDocument();

  // Check if the link to the BMI calculator for adults is rendered
  const adultLink = screen.getByText('Calculate your BMI for adults');
  expect(adultLink).toBeInTheDocument();
  expect(adultLink.closest('a')).toHaveAttribute('href', '/bmiAdults');

  // Check if the link to the BMI calculator for children and teenagers is rendered
  const childrenLink = screen.getByText('Calculate your BMI for children and teenagers');
  expect(childrenLink).toBeInTheDocument();
  expect(childrenLink.closest('a')).toHaveAttribute('href', '/bmiChildren');
});
