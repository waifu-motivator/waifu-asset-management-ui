import {render, screen} from '@testing-library/react';
import App from '../App';
import React from "react";

test('renders loading screen on startup', () => {
  render(<App/>);
  const linkElement = screen.getByTestId('loading-indicator');
  expect(linkElement).toBeInTheDocument();
});
