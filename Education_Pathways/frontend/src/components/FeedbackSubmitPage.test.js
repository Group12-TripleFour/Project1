import React from "react";
import { render, screen } from "@testing-library/react";
import FeedbackSubmitPage from "./FeedbackSubmitPage";

import renderer from 'react-test-renderer';

//Nathan
describe('<FeedbackSubmitPage />', () => {
    test('should render without crashing', () => {
        render(<FeedbackSubmitPage />);
    });
    test('snapshot', () => {
        const tree = renderer.create(<FeedbackSubmitPage />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

test("renders heading", () => {
  render(<FeedbackSubmitPage />);
  expect(screen.getByRole("heading")).toHaveTextContent("Submit Review Feedback");
});