import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";  // ✅ Import BrowserRouter
import App from "./App";

test("renders welcome message", () => {
  render(
    <BrowserRouter>  
      <App />
    </BrowserRouter>
  );  // ✅ Wrap App inside BrowserRouter

  const headingElement = screen.getByText(/welcome to workflow management system/i);
  expect(headingElement).toBeInTheDocument();
});
