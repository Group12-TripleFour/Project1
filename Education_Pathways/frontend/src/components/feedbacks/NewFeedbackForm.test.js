import React from "react";
import { render, screen } from "@testing-library/react";
import NewFeedbackForm from "./NewFeedbackForm";

import renderer from 'react-test-renderer';

//Nathan 
describe('<NewFeedbackForm />', () => {
    test('should render without crashing', () => {
        render(<NewFeedbackForm />);
    });
    test('snapshot', () => {
        const tree = renderer.create(<NewFeedbackForm />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

test("renders button", () => {
  render(<NewFeedbackForm />);
  expect(screen.getByRole("button")).toHaveTextContent("Add Feedback");
});